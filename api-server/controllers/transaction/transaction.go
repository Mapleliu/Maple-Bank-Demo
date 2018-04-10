package transactioncontroller

import (
	"github.com/astaxie/beego"
	"os"
	"mime/multipart"
	"api-server/controllers"
	"api-server/models"
	"encoding/csv"
	"encoding/json"
	"io"
	"regexp"
	"fmt"
	"crypto/sha256"
	"encoding/hex"
)

type TransactionController struct {
	beego.Controller
}

const (
	path              string = "/tmp/"
	formvale                 = 1024
	appexpression     string = `.((.(c|C)(s|S)(v|V)$))`
)

type ChainCodeData struct {
	Args []string `json:"Args"`
}

type Type2AccountInfo struct {
	BankName string `json:"bank"`
	Username string `json:"username"`
	UserID string `json:"user_id"`
	MobileNumber string `json:"mobilenumber"`
}

type Type1AccountInfo struct {
	BankName string `json:"bank"`
	UserAccount string `json:"user_account"`
}

type CreateAccount struct {
	T1AcntInfo Type1AccountInfo `json:"type1AccountInfo"`
	T2AcntInfo Type2AccountInfo `json:"type2AccountInfo"`
}

var userId string = beego.AppConfig.String("useid")

func (tc *TransactionController) FeedAccountInfo() {
	beego.Debug("upload account info")


	var (
		isMatch                 bool
		stdError                error
		fileDes                 multipart.File
		dst                     *os.File
		key                     string
		fheaders                []*multipart.FileHeader
		file                    []*multipart.FileHeader
		returnError 			string
		csvFileReader 			*csv.Reader
		fileReader 				*os.File
		uploadFilePath          string
		uploadFileName          string
		ccs 					*models.ChainCodeSpec
		channelID 				string = beego.AppConfig.String("channel_id")
		chainCodeID 			string = beego.AppConfig.String("chaincode_id")
		//chainCodeVersion 		string = beego.AppConfig.String("credit_chaincode_version")
		isTransactionFailed 	bool
		failedTransactionMessage string
	)

	bankName := tc.Ctx.Input.Param(":bank")
	if bankName == "" {
		tc.Ctx.ResponseWriter.WriteHeader(controllers.HTTPBADREQUEST)
		tc.Ctx.ResponseWriter.Write([]byte("Bank name not provided"))
		return
	}

	//chainCodeID = bankName

	uploadDir := path + bankName

	stdError = os.MkdirAll(uploadDir, os.ModeDir|os.ModePerm)
	if stdError != nil {
		tc.Ctx.ResponseWriter.WriteHeader(controllers.HTTPINTERNALSERVERERROR)
		tc.Ctx.ResponseWriter.Write([]byte(controllers.InternalServerError))
		return
	}

	stdError = tc.Ctx.Request.ParseMultipartForm(formvale * formvale)
	if stdError != nil {
		beego.Error("failed while parsing MultipartForm ", stdError)
		tc.Ctx.ResponseWriter.WriteHeader(controllers.HTTPINTERNALSERVERERROR)
		tc.Ctx.ResponseWriter.Write([]byte(controllers.InternalServerError))
		return
	}

	files := tc.Ctx.Request.MultipartForm.File
	if files != nil {
		for key, fheaders = range files {
			for _, hdr := range fheaders {
				if isMatch, stdError = regexp.MatchString(appexpression, hdr.Filename); stdError != nil ||
					isMatch == false {
					beego.Error("file name format not correct", stdError, hdr.Filename)
					returnError = "file name format not correct"
					goto errorHandler
				}
			}

			file = files[key]
			for i, _ := range file {
				fileDes, stdError = file[i].Open()
				if stdError != nil {
					beego.Error("failed while opening file", stdError)
					returnError = "failed to open uploaded file"
					goto errorHandler
				}
				defer fileDes.Close()

				//create destination file making sure the path is writeable.
				uploadFileName = file[i].Filename
				uploadFilePath = uploadDir + "/" + uploadFileName
				dst, stdError = os.Create(uploadFilePath)
				if stdError != nil {
					beego.Error("failed to create uploadFilePath", stdError)
					returnError = "failed to create uploadFilePath"
					goto errorHandler
				}
				defer dst.Close()

				//copy the uploaded file to the destination file
				if _, stdError = io.Copy(dst, fileDes); stdError != nil {
					beego.Error("failed while copying the file to the destination", stdError)
					returnError = "failed while copying the file to the destination"
					goto errorHandler
				}
			}
		}
	} else {
		beego.Error("multipartFormRequest to api server, but doesn't have MultipartForm")
		returnError = "InvalidRequest" + " MultipartFormRequest to api server, " + "but doesn't have MultipartForm"
		goto errorHandler
	}

	fileReader, stdError = os.Open(uploadFilePath)
	if stdError != nil {
		// err is printable
		// elements passed are separated by space automatically
		fmt.Println("Error:", stdError)
		returnError = "failed to read csv file"
		goto errorHandler
	}

	// automatically call Close() at the end of current method
	defer fileReader.Close()

	ccs, stdError = models.Initialize(channelID, bankName, chainCodeID, userId)
	if stdError != nil {
		beego.Error("Failed in initializing channel client :", stdError.Error())
		tc.Ctx.ResponseWriter.WriteHeader(controllers.HTTPINTERNALSERVERERROR)
		tc.Ctx.ResponseWriter.Write([]byte(stdError.Error()))
		return
	}
	defer ccs.Close()

	csvFileReader = csv.NewReader(fileReader)
	failedTransactionMessage = "Transaction failed :  "
	for {
		record, err := csvFileReader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			beego.Error(err)
		}

		beego.Info("Back Name ", record)
		beego.Info("Account record ", record)

		if len(record) != 4 {
			beego.Error("account information missing")
			continue
		}

		var chaincodeArgs [][]byte
		//chaincodeArgs = append(chaincodeArgs, []byte("creditAccountInfo"))
		chaincodeArgs = append(chaincodeArgs, []byte(bankName))

		for _, data := range record {
			chaincodeArgs = append(chaincodeArgs, []byte(data))
		}

		_, err = ccs.ChaincodeInvoke("creditAccountInfo", chaincodeArgs)
		if err != nil {
			isTransactionFailed = true
			if len(record) > 1 {
				failedTransactionMessage = failedTransactionMessage +  record[0]
			}
			beego.Error("some issue in commiting account info ", err.Error())
		}
	}

	if isTransactionFailed {
		tc.Ctx.ResponseWriter.WriteHeader(controllers.HTTPBADREQUEST)
		tc.Ctx.ResponseWriter.Write([]byte(failedTransactionMessage))
		return
	}

	tc.Ctx.ResponseWriter.WriteHeader(controllers.HTTPCreated)
	return

errorHandler:
	ers := os.RemoveAll(uploadDir)
	if ers != nil {
		beego.Error("failed to remove the directory uploadDir: ", uploadDir, ers)
	}

	tc.Ctx.ResponseWriter.WriteHeader(controllers.HTTPINTERNALSERVERERROR)
	tc.Ctx.ResponseWriter.Write([]byte(returnError))
	return
}

func (tc *TransactionController) CreateType2Account() {
	beego.Debug("create type2 account")

	var (
		stdError                error
		ccs 					*models.ChainCodeSpec
		channelID 				string = beego.AppConfig.String("channel_id")
		chainCodeName 			string = beego.AppConfig.String("chaincode_id")
		//chainCodeVersion 		string = beego.AppConfig.String("accountvalidate_chaincode_version")
		createAccount 			*CreateAccount = new(CreateAccount)
	)

	stdError = json.Unmarshal(tc.Ctx.Input.RequestBody, &createAccount)
	if stdError != nil {
		tc.Ctx.ResponseWriter.WriteHeader(controllers.HTTPINTERNALSERVERERROR)
		tc.Ctx.ResponseWriter.Write([]byte(fmt.Sprintf("json unmarshal failed %s", stdError.Error())))
		return
	}

	//chainCodeName = createAccount.T1AcntInfo.BankName

	ccs, stdError = models.Initialize(channelID, createAccount.T2AcntInfo.BankName, chainCodeName, userId)
	if stdError != nil {
		beego.Error("Failed in initializing channel client :", stdError.Error())
		tc.Ctx.ResponseWriter.WriteHeader(controllers.HTTPINTERNALSERVERERROR)
		tc.Ctx.ResponseWriter.Write([]byte(fmt.Sprintf("blockchain communication error %s", stdError.Error())))
		return
	}
	defer ccs.Close()


	var chaincodeArgs [][]byte
	//chaincodeArgs = append(chaincodeArgs, []byte("authAccount"))
	chaincodeArgs = append(chaincodeArgs, []byte(createAccount.T1AcntInfo.BankName))
	chaincodeArgs = append(chaincodeArgs, []byte(createAccount.T2AcntInfo.UserID))

	accountHashReturned, stdError := ccs.ChaincodeQuery("authAccount", chaincodeArgs)
	if stdError != nil {
		beego.Error("some issue in getting account info ", stdError.Error())
		tc.Ctx.ResponseWriter.WriteHeader(controllers.HTTPNotFound)
		tc.Ctx.ResponseWriter.Write([]byte(fmt.Sprintf("blockchain response %s", stdError.Error())))
	}

	accountValue := createAccount.T2AcntInfo.Username + createAccount.T2AcntInfo.UserID +
					createAccount.T1AcntInfo.UserAccount + createAccount.T2AcntInfo.MobileNumber
	valueHashGenerator := sha256.New()
	valueHashGenerator.Write([]byte(accountValue))
	accountHash := valueHashGenerator.Sum(nil)

	fmt.Println("Account key info :", accountValue)
	fmt.Println("Account hash : ", accountHash, hex.EncodeToString(accountHash))
	fmt.Println("Account hash Returned : ", accountHashReturned, hex.EncodeToString(accountHashReturned))

	if hex.EncodeToString(accountHash) != hex.EncodeToString(accountHashReturned){
		beego.Error("input data donot match  ")
		tc.Ctx.ResponseWriter.WriteHeader(controllers.HTTPNotFound)
		tc.Ctx.ResponseWriter.Write([]byte(fmt.Sprintf("input data donot match")))
	}

	tc.Ctx.ResponseWriter.WriteHeader(controllers.HTTPCreated)
	return
}


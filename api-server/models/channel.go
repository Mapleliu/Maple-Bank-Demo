package models


import (

	"fmt"
	"github.com/astaxie/beego"
	"github.com/hyperledger/fabric-sdk-go/api/apitxn"
	"github.com/hyperledger/fabric-sdk-go/def/fabapi"
	//"time"
)

// Chaincode-related variables.
var (
	//userId     string
	//channelID     string
)

type ChainCodeSpec struct {
	channelClient apitxn.ChannelClient
	userID string
	chainCodeID string
}

// Initialize reads the configuration file and sets up the client, chain and event hub
func Initialize(channelID, bank, chainCodeId, userId string)  (*ChainCodeSpec,error) {
	var configFile string
	if bank == "xxx1" {
		configFile =  beego.AppConfig.String("CORE_XXX1_CONFIG_FILE")
	} else if  bank == "xxx2"{
		configFile =  beego.AppConfig.String("CORE_XXX2_CONFIG_FILE")
	} else {
		configFile =  beego.AppConfig.String("CORE_XXX3_CONFIG_FILE")
	}

	chnlClient, err := getChannelClient(channelID, configFile, userId)
	if err != nil {
		return nil, err
	}

	return &ChainCodeSpec{channelClient: chnlClient, chainCodeID: chainCodeId, userID: userId}, nil
}

func getChannelClient(channelID, configFile, userId string) (apitxn.ChannelClient, error) {

	var chClient apitxn.ChannelClient
	// Create SDK setup for the integration tests
	sdkOptions := fabapi.Options{
		ConfigFile: configFile,
	}

	sdk, err := fabapi.NewSDK(sdkOptions)
	if err != nil {
		beego.Error("Failed to create new SDK instance:", err)
		return nil, err
	}

	chClient, err = sdk.NewChannelClient(channelID, userId)
	if err != nil {
		beego.Error("Failed to create new channel client instance:", err)
		return nil, err
	}

	return chClient, err
}

//cf *peerChaincode.ChaincodeCmdFactory
func (ccs *ChainCodeSpec) ChaincodeInvoke(fcn string,chaincodeArgs [][]byte) (responsePayload []byte, err error) {
	//eventID := "test123"

	// Register chaincode event (pass in channel which receives event details when the event is complete)
	//notifier := make(chan *apitxn.CCEvent)
	//rce := ccs.channelClient.RegisterChaincodeEvent(notifier, ccs.chainCodeID, eventID)

	//Invokes Tx basically the non-query types
	_, err = ccs.channelClient.ExecuteTx(apitxn.ExecuteTxRequest{ChaincodeID: ccs.chainCodeID, Fcn: fcn, Args: chaincodeArgs})
	if err != nil {
		beego.Error(fmt.Sprintf("Error in executing transaction : %s", err.Error()))
		return nil, err
	}

	//var responseReceived bool
	//select {
	//case ccEvent := <-notifier:
	//	beego.Info("Received CC event", ccEvent)
	//	responseReceived = true
	//	responsePayload = ccEvent.Payload
	//case <-time.After(time.Second * 60):
	//	beego.Info("Did NOT receive CC event for eventId", eventID)
	//}

	//// Unregister chain code event using registration handle
	//err = ccs.channelClient.UnregisterChaincodeEvent(rce)
	//if err != nil {
	//	beego.Error("Unregister cc event failed:", err)
	//	err = fmt.Errorf("error in unregistering chaincode event : %s", err.Error())
	//	return
	//}
	//
	//if responseReceived == false {
	//	beego.Error("response not received in specified time :", err)
	//	err = fmt.Errorf("esponse not received in %d second", 20)
	//}

	return nil, nil
}

func (ccs *ChainCodeSpec) ChaincodeQuery(fcn string,chaincodeArgs [][]byte) (responsePayload []byte, err error) {

	value, err := ccs.channelClient.Query(apitxn.QueryRequest{ChaincodeID: ccs.chainCodeID, Fcn: fcn, Args: chaincodeArgs})
	if err != nil {
		beego.Error("Failed to invoke query function of the chaincode:", err)
		return nil, err
	}

	return value, err
}

func (ccs *ChainCodeSpec) Close (){
	ccs.channelClient.Close()
}

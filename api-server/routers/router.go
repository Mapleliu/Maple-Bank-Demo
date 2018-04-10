package routers

import (
	"api-server/controllers"
	"github.com/astaxie/beego"
	"api-server/controllers/transaction"
)

func init() {
    beego.Router("/", &controllers.MainController{})
	beego.Router("/blockchain", &controllers.MainController{}, "get:GetDefaultBlockchain")
	beego.Router("/blockchain/:bank/userdetails", &transactioncontroller.TransactionController{}, "post:FeedAccountInfo")
	beego.Router("/blockchain/createaccount", &transactioncontroller.TransactionController{}, "post:CreateType2Account")
}

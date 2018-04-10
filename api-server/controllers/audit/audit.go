package auditcontroller

import (
	"github.com/astaxie/beego"
	"api-server/controllers"
)

const (
	HTTPOK             = 201
)

type AuditController struct {
	beego.Controller
}

func (ac *AuditController) Get() {
	ac.Ctx.ResponseWriter.WriteHeader(controllers.HTTPOK)
	ac.ServeJSON()
	return
}

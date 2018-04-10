package controllers

import (
	"github.com/astaxie/beego"
)

const (
	HTTPOK             		= 200
	HTTPNotFound            = 404
	HTTPNoContent           = 204
	HTTPCreated             = 201
	HTTPFound               = 302
	HTTPForbidden           = 403
	HTTPOk                  = 200
	HTTPBADREQUEST          = 400
	HTTPINTERNALSERVERERROR = 500
	HTTPInternalServerError = 500
	HTTPBadRequest          = 400
	HTTPUnauthorized        = 401
	HTTPOneLessMinRes       = 199
	HTTPOneLessMaxRes       = 299
	HTTPNonAuthInfo         = 203
	HTTPConflict            = 409
	HTTPRedirect            = 300
	InternalServerError = "Internal server error"
)

type MainController struct {
	beego.Controller
}

func (mc *MainController) Get() {
	mc.Ctx.ResponseWriter.WriteHeader(HTTPOK)
	mc.Ctx.ResponseWriter.Write([]byte("This is default page"))
	return
}


func (mc *MainController) GetDefaultBlockchain() {
	mc.Ctx.ResponseWriter.WriteHeader(HTTPOK)
	mc.Ctx.ResponseWriter.Write([]byte("This is default page of blockchain"))
	return
}
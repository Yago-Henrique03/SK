using SK.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SK.Controllers
{
    public class AdminController : Controller
    {
        private ProdutoREPO produtoapp = new ProdutoREPO();

        public object JsonConvert { get; private set; }

        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public RedirectToRouteResult Post(Produto produto)
        {
            produtoapp.NewProduct(produto);
            return RedirectToAction("Index", "Home");
        }

        public JsonResult ListarId(int id)
        {
            var produto = produtoapp.ListarId(id);
            return Json(produto, JsonRequestBehavior.AllowGet);
        }
    }
}
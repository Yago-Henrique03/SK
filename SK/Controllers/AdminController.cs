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
        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Post(Produto produto)
        {
            produtoapp.NewProduct(produto);
            return RedirectToAction("Index", "Home");
        }
    }
}
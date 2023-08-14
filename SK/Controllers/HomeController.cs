using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SK.Models;

namespace SK.Controllers
{
    public class HomeController : Controller
    {
        
        private ProdutoREPO produtoapp = new ProdutoREPO();

        // GET: Home
        public ActionResult Index()
        {
           
            var lista = produtoapp.ListarTodos();
            return View(lista);
        }

        public ActionResult ViewProduct(int id)
        {
            var item = produtoapp.ListarId(id);
            //cria view de visualizacao
            return View(item);
        }
    }
}
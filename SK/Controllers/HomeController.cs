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
        // GET: Home
        public ActionResult Index()
        {
            ProdutoREPO produto = new ProdutoREPO();

            var lista = produto.ListarTodos();
            return View(lista);
        }

        public ActionResult Index(Produto produto)
        {

            return View();
        }


        public ActionResult VisualizacaoSkin(Produto produto)
        {
            //cria view de visualizacao
            return View();
        }
    }
}
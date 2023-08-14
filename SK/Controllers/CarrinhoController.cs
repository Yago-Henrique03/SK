using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SK.Models;
namespace SK.Controllers
{
    public class CarrinhoController : Controller
    {
        private CarrinhoREPO carrinho = new CarrinhoREPO();
        // GET: Carrinho
        public ActionResult Index()
        {
            var produtosOnChart = carrinho.ListarTodos();
            return View(produtosOnChart);
        }

        public void AddToCart(int id)
        {
            carrinho.AddToCart(id);
        }

        public void RemoveFromCart(int id)
        {
            carrinho.RemoveFromCart(id);
        }

        public void Increment(int id)
        {
            carrinho.Increment(id);
        }

        public void Decrement(int id)
        {
            carrinho.Decrement(id);
        }
    }
}
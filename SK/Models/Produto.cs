using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SK.Models
{
    public class Produto
    {
        public int ProdutoId { get; set; }
        public string Nome_Produto { get; set; }
        public string ImageUrl { get; set; }
        public decimal Preco { get; set; }
        public string Tipo { get; set; }
    }
}
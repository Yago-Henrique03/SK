using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SK.Models
{
    public class Carrinho: Produto
    {
        public int Id_ProdutoChart { get; set;}
        public int Quantidade { get; set; }

    }
}
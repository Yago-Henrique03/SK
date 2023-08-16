using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SK.Models.contexto;
using System.Data.SqlClient;

namespace SK.Models
{
    public class CarrinhoREPO
    {
        private Contexto contexto;
        public IEnumerable<Produto> ListarTodos()
        {
            using (contexto = new Contexto())
            {
                var strQuery = "SELECT Carrinho.Id_ProdutoChart, Carrinho.Quantidade, Produto.ProdutoId, Produto.Nome_Produto, Produto.Preco, Produto.ImageUrl FROM Carrinho INNER JOIN Produto ON Carrinho.ProdutoId = Produto.ProdutoId";
                var retornoDataReader = contexto.ExecutaComandoRetorno(strQuery);
                return TransformaReaderEmListaDeObjeto(retornoDataReader);
            }
        }

        public void AddToCart(int id)
        {
            
            using (contexto = new Contexto())
            {
                var strQueryProduct = $"SELECT * FROM CARRINHO WHERE ProdutoId = {id}";
                var produto = contexto.ExecutaComandoRetorno(strQueryProduct);
                var newProductObj = TransformaReaderEmListaDeObjeto2(produto);
                if ( newProductObj.Count() == 0)
                {
                    var strQuery = string.Format("INSERT INTO Carrinho VALUES ({0}, 1)", id);
                    contexto.ExecutaComando(strQuery);
                } 

            }
        }

        public void RemoveFromCart(int id)
        {
            using( contexto = new Contexto())
            {
                var strQuery = string.Format("DELETE FROM Carrinho WHERE ProdutoId = {0}", id);
                contexto.ExecutaComando(strQuery);
            }
        }

        public void Increment(int Id)
        {
            using(contexto = new Contexto())
            {
                var strQuery = string.Format("UPDATE CARRINHO SET Quantidade = Quantidade + 1 WHERE ProdutoId = {0}", Id);
                contexto.ExecutaComando(strQuery);
            }
        }

        public void Decrement(int Id)
        {
            using( contexto = new Contexto())
            {
                var strQuery = string.Format("UPDATE CARRINHO SET Quantidade = Quantidade-1 WHERE ProdutoId = ${0}", Id);
                contexto.ExecutaComando(strQuery);
            }
        }

        private List<Carrinho> TransformaReaderEmListaDeObjeto(SqlDataReader reader)
        {
            var produtosOnChart = new List<Carrinho>();
            while (reader.Read())
            {
                var temObjeto = new Carrinho()
                {
                    Id_ProdutoChart = int.Parse(reader["Id_ProdutoChart"].ToString()),
                    Quantidade = int.Parse(reader["Quantidade"].ToString()),
                    ProdutoId = int.Parse(reader["ProdutoId"].ToString()),
                    Nome_Produto = reader["Nome_Produto"].ToString(),
                    ImageUrl = reader["ImageUrl"].ToString(),
                    Preco = Decimal.Parse(reader["Preco"].ToString()),
                };

                produtosOnChart.Add(temObjeto);
            }
            reader.Close();
            return produtosOnChart;
        }

        private List<Carrinho> TransformaReaderEmListaDeObjeto2(SqlDataReader reader)
        {
            var produtosOnChart = new List<Carrinho>();
            while (reader.Read())
            {
                var temObjeto = new Carrinho()
                {
                    Id_ProdutoChart = int.Parse(reader["Id_ProdutoChart"].ToString()),
                    ProdutoId = int.Parse(reader["ProdutoId"].ToString()),
                    Quantidade = int.Parse(reader["Quantidade"].ToString()),
                };

                produtosOnChart.Add(temObjeto);
            }
            reader.Close();
            return produtosOnChart;
        }
    }
}
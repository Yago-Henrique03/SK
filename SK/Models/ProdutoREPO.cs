using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SK.Models.contexto;
using System.Data.SqlClient;

namespace SK.Models
{
    public class ProdutoREPO
    {
        private Contexto contexto;
        public IEnumerable<Produto> ListarTodos()
        {
            using (contexto = new Contexto())
            {
                var strQuery = "SELECT * FROM PRODUTO";
                var retornoDataReader = contexto.ExecutaComandoRetorno(strQuery);
                return TransformaReaderEmListaDeObjeto(retornoDataReader);
            }
        }

        public Produto ListarId(int Id)
        {
            using (contexto = new Contexto())
            {
                var strQuery = string.Format("SELECT * FROM PRODUTO WHERE ProdutoId = {0}", Id);
                var retornoDataReader = contexto.ExecutaComandoRetorno(strQuery);
                return TransformaReaderEmListaDeObjeto(retornoDataReader).FirstOrDefault();
            }
        }

        private List<Produto> TransformaReaderEmListaDeObjeto(SqlDataReader reader)
        {
            var alunos = new List<Produto>();
            while (reader.Read())
            {
                var temObjeto = new Produto()
                {
                    ProdutoId = int.Parse(reader["ProdutoId"].ToString()),
                    Nome_Produto = reader["Nome_Produto"].ToString(),
                    ImageUrl = reader["ImageUrl"].ToString(),
                    Preco = Decimal.Parse(reader["Preco"].ToString()),
                    Tipo = reader["Tipo"].ToString()
                };
                alunos.Add(temObjeto);
            }
            reader.Close();
            return alunos;
        }

        public void NewProduct(Produto produto)
        {
            using( contexto = new Contexto())
            {
                var culture = new System.Globalization.CultureInfo("en-US");
                if(produto.ProdutoId == 0)
                {
                    var strQuery = $"INSERT INTO Produto VALUES ('{produto.Nome_Produto}', {produto.Preco.ToString("0.00", culture)}, '{produto.Tipo}', '{produto.ImageUrl}')";
                    contexto.ExecutaComando(strQuery);
                } else
                {
                    var strQuery = $"UPDATE Produto SET Nome_Produto='{produto.Nome_Produto}', Preco={produto.Preco.ToString("0.00", culture)}, '{produto.Tipo}', '{produto.ImageUrl}' WHERE ProdutoId={produto.ProdutoId}";
                    contexto.ExecutaComando(strQuery);
                }
                    
            }
        }
    }
}
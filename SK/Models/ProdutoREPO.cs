using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SK.Models.contexto;
using System.Data.SqlClient;
using System.Data;

namespace SK.Models
{
    public class ProdutoREPO
    {
        private Contexto contexto;
        public IEnumerable<Produto> ListarTodos()
        {
            using (contexto = new Contexto())
            {
                var nomeProcedure = "dbo.listar";

                var parametro1 = new SqlParameter("@TableName", SqlDbType.NVarChar, 128);
                parametro1.Value = "PRODUTO";

                var parametro2 = new SqlParameter("@Campo", System.Data.SqlDbType.NVarChar, 128);
                parametro2.Value = "";

                var parametro3 = new SqlParameter("@Parameter", SqlDbType.NVarChar, 1000);
                parametro3.Value = "";

                var retornoDataReader = contexto.ExecutaProcedureComRetorno(nomeProcedure, parametro1, parametro2, parametro3);
                return TransformaReaderEmListaDeObjeto(retornoDataReader);
                //var strQuery = "SELECT * FROM PRODUTO";
                //var retornoDataReader = contexto.ExecutaComandoRetorno(strQuery);
                //return TransformaReaderEmListaDeObjeto(retornoDataReader);
            }
        }

        public Produto ListarId(int Id)
        {
            using (contexto = new Contexto())
            {
                var nomeProcedure = "dbo.listar";

                var parametro1 = new SqlParameter("@TableName", SqlDbType.NVarChar, 128);
                parametro1.Value = "PRODUTO";

                var parametro2 = new SqlParameter("@Campo", System.Data.SqlDbType.NVarChar, 128) { Value = "ProdutoId" };

                var parametro3 = new SqlParameter("@Parameter", SqlDbType.NVarChar, 1000) { Value = Id };

                var retornoDataReader = contexto.ExecutaProcedureComRetorno(nomeProcedure, parametro1, parametro2, parametro3);
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
                var ProdutoId = new SqlParameter("@ProdutoId", SqlDbType.Int) { Value = produto.ProdutoId };
                var Nome_Produto = new SqlParameter("@Nome_Produto", SqlDbType.NVarChar, 50) { Value = produto.Nome_Produto };
                var Preco = new SqlParameter("@Preco", SqlDbType.Decimal) { Value = produto.Preco };
                var Tipo = new SqlParameter("@Tipo", SqlDbType.NVarChar, 50) { Value = produto.Tipo };
                var ImageUrl = new SqlParameter("@ImageUrl", SqlDbType.NVarChar, -1) { Value = produto.ImageUrl };

                contexto.ExecutaProcedure("dbo.AdicionarProduto", ProdutoId, Nome_Produto, Preco, Tipo, ImageUrl);
                    
            }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.SqlClient;
using System.Web;
using System.Data;

namespace SK.Models.contexto
{
    public class Contexto:IDisposable
    {
        private readonly SqlConnection connection;
        public Contexto()
        {
            connection = new SqlConnection(@"Data Source=DESKTOP-395J393\SQLEXPRESS; Integrated Security=SSPI;Initial Catalog=db_SkinsShop");
            connection.Open();
        }

        public void ExecutaComando(string query)
        {
            SqlCommand cmd = new SqlCommand
            {
                CommandText = query,
                CommandType = CommandType.Text,
                Connection = connection
            };
            cmd.ExecuteNonQuery();
        }

        public SqlDataReader ExecutaComandoRetorno(string query)
        {
            SqlCommand cmd = new SqlCommand(query, connection);
            return cmd.ExecuteReader();
        }

        public void Dispose()
        {
            if (connection.State == ConnectionState.Open)
                connection.Close();
        }
    }
}
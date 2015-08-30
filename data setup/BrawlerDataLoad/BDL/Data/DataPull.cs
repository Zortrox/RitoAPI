using System.Data;
using System.Data.SqlClient;

namespace BDL.Data
{
    /// <summary>
    /// Allows retrieving data from the database
    /// </summary>
    class DataPull
    {
        private const string CONNECTION_STRING = "Data Source=(local)\\LocalDB;Initial Catalog=MuchBrawlers;Integrated Security=True";

        public DataPull()
        {

        }

        public DataView PullTimeGraph()
        {
            string sp = "up_PullTimeGraph";
            DataSet ds = new DataSet();

            using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
            {
                try
                {
                    using (SqlCommand cmd = new SqlCommand(sp, con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 2400;

                        SqlDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = cmd;
                        da.Fill(ds);
                    }
                }
                finally
                {
                    con.Close();
                }
            }

            return ds.Tables[0].DefaultView;
        }

        public DataView PullChampInfo()
        {
            string sp = "up_PullChampInfo";
            DataSet ds = new DataSet();

            using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
            {
                try
                {
                    using (SqlCommand cmd = new SqlCommand(sp, con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 600;

                        SqlDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = cmd;
                        da.Fill(ds);
                    }
                }
                finally
                {
                    con.Close();
                }
            }

            return ds.Tables[0].DefaultView;
        }
    }
}

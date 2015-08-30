using System.Collections.Generic;
using System.Windows.Forms;

namespace BDL.UI
{
    /// <summary>
    /// A branch UI form that allows for selecting which data storing/loading queries to execute
    /// </summary>
    public partial class fmQuerySelect : Form
    {
        public bool isSubmit = false;
        List<ListViewItem> m_queries;
        List<string> m_previouslySelected;

        public fmQuerySelect(ListView.ListViewItemCollection col)
        {
            InitializeComponent();
            m_queries = new List<ListViewItem>();
            m_previouslySelected = new List<string>();

            foreach (ListViewItem item in col)
            {
                clbQueries.SetItemChecked(clbQueries.Items.IndexOf(item.Text), true);
                m_previouslySelected.Add(item.Text);
            }
        }

        public new List<ListViewItem> ShowDialog()
        {
            base.ShowDialog();

            if (isSubmit)
            {
                foreach (string check in clbQueries.CheckedItems)
                {
                    if (!m_previouslySelected.Contains(check))
                        m_queries.Add(new ListViewItem(check));
                }
            }

            return (m_queries);
        }

        #region Events
        private void btnOK_Click(object sender, System.EventArgs e)
        {
            isSubmit = true;
            Close();
        }

        private void btnCancel_Click(object sender, System.EventArgs e)
        {
            Close();
        }

        private void btnSelect_Click(object sender, System.EventArgs e)
        {
            for (int i = 0; i < clbQueries.Items.Count; i++)
            {
                clbQueries.SetItemChecked(i, true);
            }
        } 
        #endregion
    }
}

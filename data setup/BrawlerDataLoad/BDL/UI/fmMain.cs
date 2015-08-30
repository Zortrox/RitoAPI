using System;
using System.Collections.Generic;
using System.Windows.Forms;
using BDL.Business;
using System.Threading.Tasks;

namespace BDL.UI
{
    /// <summary>
    /// The main UI form
    /// </summary>
    public partial class fmMain : Form
    {
        public fmMain()
        {
            InitializeComponent();
        }

        private void Form_Load(object sender, EventArgs e)
        {
            InitializeOpenFileDialog();
        }

        private void InitializeOpenFileDialog()
        {
            openFileDialog1.Filter = "Javascript Objects (*.JSON)|*.JSON|" +
                                     "All Files (*.*)|*.*";
            openFileDialog1.Multiselect = true;
            openFileDialog1.Title = "Select JSON Files";
        }

        #region Events
        private void lvSelection_ItemActivate(object sender, EventArgs e)
        {
            lvSelection.Items.RemoveAt(lvSelection.SelectedIndices[0]);
        }

        private void btnSelect_Click(object sender, EventArgs e)
        {
            if (rbLoadJSON.Checked)
            {
                DialogResult dr = openFileDialog1.ShowDialog();
                if (dr == DialogResult.OK)
                {
                    List<ListViewItem> items = new List<ListViewItem>();
                    foreach (string file in openFileDialog1.FileNames)
                    {
                        ListViewItem item = new ListViewItem(file);
                        items.Add(item);
                    }

                    lvSelection.BeginUpdate();
                    lvSelection.Items.AddRange(items.ToArray());
                    lvSelection.Sort();
                    lvSelection.EndUpdate();
                }
            }
            else if (rbRunQueries.Checked)
            {
                fmQuerySelect prompt = new fmQuerySelect(lvSelection.Items);
                List<ListViewItem> items = (prompt.ShowDialog());
                foreach (ListViewItem i in items)
                {
                    lvSelection.Items.Add(i);
                }
            }
        }

        private void btnRun_Click(object sender, EventArgs e)
        {
            EnableControls(false);
            SetTitle("Running...");

            if (rbLoadJSON.Checked)
            {
                Task.Factory.StartNew(() => // creates a new task to prevent locking UI
               {
                   int index = 0;
                   List<string> items = GetSelection();
                   string[] itemsArray = items.ToArray();
                   SaveLogic sl = new SaveLogic();

                   Parallel.For // for spreading the small load into multiple threads
                   (
                       0, // start index
                       itemsArray.Length, // end index
                       i => // index variable
                       {
                           sl.SaveMatchData(items[i]);
                           SetTitle("Running... - " + (++index) + " of " + itemsArray.Length);  // possibly thread-unsafe index incrementing
                       }                                                                        // but makes little difference in the end
                   );

                   OperationFinished();
               });
            }
            else if (rbRunQueries.Checked)
            {
                Task.Factory.StartNew(() => // creates a new task to prevent locking UI
                {
                    SaveLogic sl = new SaveLogic();
                    LoadLogic ll = new LoadLogic();
                    List<string> items = GetSelection();
                    Parallel.ForEach // for spreading the small load into multiple threads
                    (
                        items, lvi =>
                        {
                            switch (lvi)
                            {
                                case "SaveChampData":
                                {
                                    sl.SaveChampData();
                                    break;
                                }
                                case "SaveItemData":
                                {
                                    sl.SaveItemData();
                                    break;
                                }
                                case "SaveSumSpellData":
                                {
                                    sl.SaveSumSpellData();
                                    break;
                                }
                                case "LoadTimeGraph":
                                {
                                    ll.LoadTimeGraph();
                                    break;
                                }
                                case "LoadChampInfo":
                                {
                                    ll.LoadChampInfo();
                                    break;
                                }
                            }
                        }
                    );
                    OperationFinished();
                });
            }
        }

        private void btnClear_Click(object sender, EventArgs e)
        {
            lvSelection.Items.Clear();
        }

        private void rbLayoutChange(object sender, EventArgs e)
        {
            if (rbLoadJSON.Checked)
            {
                lvSelection.Items.Clear();
                btnSelect.Text = "Select Files";
            }
            else if (rbRunQueries.Checked)
            {
                lvSelection.Items.Clear();
                btnSelect.Text = "Select Queries";
            }
        }
        #endregion

        #region Utility Functions
        // Allows unlocking the UI after the task is finished, even if run on a seperate thread
        private void OperationFinished()
        {
            if (this.InvokeRequired)
            {
                OperationFinishedCallback d = new OperationFinishedCallback(OperationFinished);
                this.Invoke(d, new object[] { });
            }
            else
            {
                MessageBox.Show("Operation Finished");
                EnableControls(true);
                SetTitle("Brawlers Data Load");
            }
        }

        // Allows setting the application title from seperate threads
        private void SetTitle(string s)
        {
            if (this.InvokeRequired)
            {
                SetTitleCallback d = new SetTitleCallback(SetTitle);
                this.Invoke(d, new object[] { s });
            }
            else
            {
                this.Text = s;
            }
        }

        // Just a helpful method to streamline enabling/disabling all controls
        private void EnableControls(bool enable)
        {
            btnRun.Enabled = enable;
            btnSelect.Enabled = enable;
            btnClear.Enabled = enable;
            rbLoadJSON.Enabled = enable;
            rbRunQueries.Enabled = enable;

            if (enable)
                lvSelection.ItemActivate += lvSelection_ItemActivate;
            else
                lvSelection.ItemActivate -= lvSelection_ItemActivate;
        }

        // Allows acquiring a list of the selected items from seperate threads
        private List<string> GetSelection()
        {
            List<string> temp = new List<string>();
            if (this.InvokeRequired)
            {
                GetSelectionCallback d = new GetSelectionCallback(GetSelection);
                return (List<string>)Invoke(d, new object[] {});
            }
            else
            {
                foreach (ListViewItem item in lvSelection.Items)
                    temp.Add((string)item.Text.Clone());
                return (temp);
            }
        }
        #endregion

        #region Delegates
        delegate void SetTitleCallback(string s);

        delegate void OperationFinishedCallback();

        delegate List<string> GetSelectionCallback();

        #endregion


    }
}
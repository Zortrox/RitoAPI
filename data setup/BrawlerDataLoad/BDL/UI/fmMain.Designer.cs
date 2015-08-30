namespace BDL.UI
{
    partial class fmMain
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.openFileDialog1 = new System.Windows.Forms.OpenFileDialog();
            this.splitContainer1 = new System.Windows.Forms.SplitContainer();
            this.splitContainer3 = new System.Windows.Forms.SplitContainer();
            this.btnClear = new System.Windows.Forms.Button();
            this.rbRunQueries = new System.Windows.Forms.RadioButton();
            this.rbLoadJSON = new System.Windows.Forms.RadioButton();
            this.lvSelection = new System.Windows.Forms.ListView();
            this.col1 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.splitContainer2 = new System.Windows.Forms.SplitContainer();
            this.btnSelect = new System.Windows.Forms.Button();
            this.btnRun = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).BeginInit();
            this.splitContainer1.Panel1.SuspendLayout();
            this.splitContainer1.Panel2.SuspendLayout();
            this.splitContainer1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer3)).BeginInit();
            this.splitContainer3.Panel1.SuspendLayout();
            this.splitContainer3.Panel2.SuspendLayout();
            this.splitContainer3.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer2)).BeginInit();
            this.splitContainer2.Panel1.SuspendLayout();
            this.splitContainer2.Panel2.SuspendLayout();
            this.splitContainer2.SuspendLayout();
            this.SuspendLayout();
            // 
            // openFileDialog1
            // 
            this.openFileDialog1.FileName = "openFileDialog1";
            // 
            // splitContainer1
            // 
            this.splitContainer1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.splitContainer1.IsSplitterFixed = true;
            this.splitContainer1.Location = new System.Drawing.Point(0, 0);
            this.splitContainer1.Name = "splitContainer1";
            this.splitContainer1.Orientation = System.Windows.Forms.Orientation.Horizontal;
            // 
            // splitContainer1.Panel1
            // 
            this.splitContainer1.Panel1.Controls.Add(this.splitContainer3);
            // 
            // splitContainer1.Panel2
            // 
            this.splitContainer1.Panel2.Controls.Add(this.splitContainer2);
            this.splitContainer1.Size = new System.Drawing.Size(403, 380);
            this.splitContainer1.SplitterDistance = 340;
            this.splitContainer1.TabIndex = 0;
            // 
            // splitContainer3
            // 
            this.splitContainer3.Dock = System.Windows.Forms.DockStyle.Fill;
            this.splitContainer3.IsSplitterFixed = true;
            this.splitContainer3.Location = new System.Drawing.Point(0, 0);
            this.splitContainer3.Name = "splitContainer3";
            this.splitContainer3.Orientation = System.Windows.Forms.Orientation.Horizontal;
            // 
            // splitContainer3.Panel1
            // 
            this.splitContainer3.Panel1.Controls.Add(this.btnClear);
            this.splitContainer3.Panel1.Controls.Add(this.rbRunQueries);
            this.splitContainer3.Panel1.Controls.Add(this.rbLoadJSON);
            // 
            // splitContainer3.Panel2
            // 
            this.splitContainer3.Panel2.Controls.Add(this.lvSelection);
            this.splitContainer3.Size = new System.Drawing.Size(403, 340);
            this.splitContainer3.SplitterDistance = 33;
            this.splitContainer3.TabIndex = 0;
            // 
            // btnClear
            // 
            this.btnClear.Dock = System.Windows.Forms.DockStyle.Right;
            this.btnClear.Location = new System.Drawing.Point(300, 0);
            this.btnClear.Name = "btnClear";
            this.btnClear.Size = new System.Drawing.Size(103, 33);
            this.btnClear.TabIndex = 2;
            this.btnClear.Text = "Clear List";
            this.btnClear.UseVisualStyleBackColor = true;
            this.btnClear.Click += new System.EventHandler(this.btnClear_Click);
            // 
            // rbRunQueries
            // 
            this.rbRunQueries.AutoSize = true;
            this.rbRunQueries.Dock = System.Windows.Forms.DockStyle.Left;
            this.rbRunQueries.Location = new System.Drawing.Point(95, 0);
            this.rbRunQueries.Name = "rbRunQueries";
            this.rbRunQueries.Padding = new System.Windows.Forms.Padding(10, 0, 0, 0);
            this.rbRunQueries.Size = new System.Drawing.Size(94, 33);
            this.rbRunQueries.TabIndex = 1;
            this.rbRunQueries.Text = "Run Queries";
            this.rbRunQueries.UseVisualStyleBackColor = true;
            this.rbRunQueries.CheckedChanged += new System.EventHandler(this.rbLayoutChange);
            // 
            // rbLoadJSON
            // 
            this.rbLoadJSON.AutoSize = true;
            this.rbLoadJSON.Checked = true;
            this.rbLoadJSON.Dock = System.Windows.Forms.DockStyle.Left;
            this.rbLoadJSON.Location = new System.Drawing.Point(0, 0);
            this.rbLoadJSON.Name = "rbLoadJSON";
            this.rbLoadJSON.Padding = new System.Windows.Forms.Padding(10, 0, 0, 0);
            this.rbLoadJSON.Size = new System.Drawing.Size(95, 33);
            this.rbLoadJSON.TabIndex = 0;
            this.rbLoadJSON.TabStop = true;
            this.rbLoadJSON.Text = "Load JSONs";
            this.rbLoadJSON.UseVisualStyleBackColor = true;
            // 
            // lvSelection
            // 
            this.lvSelection.Activation = System.Windows.Forms.ItemActivation.OneClick;
            this.lvSelection.Alignment = System.Windows.Forms.ListViewAlignment.SnapToGrid;
            this.lvSelection.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.col1});
            this.lvSelection.Dock = System.Windows.Forms.DockStyle.Fill;
            this.lvSelection.HeaderStyle = System.Windows.Forms.ColumnHeaderStyle.None;
            this.lvSelection.Location = new System.Drawing.Point(0, 0);
            this.lvSelection.MultiSelect = false;
            this.lvSelection.Name = "lvSelection";
            this.lvSelection.Size = new System.Drawing.Size(403, 303);
            this.lvSelection.TabIndex = 0;
            this.lvSelection.UseCompatibleStateImageBehavior = false;
            this.lvSelection.View = System.Windows.Forms.View.Details;
            this.lvSelection.ItemActivate += new System.EventHandler(this.lvSelection_ItemActivate);
            // 
            // col1
            // 
            this.col1.Text = "Selected Files";
            this.col1.Width = 325;
            // 
            // splitContainer2
            // 
            this.splitContainer2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.splitContainer2.IsSplitterFixed = true;
            this.splitContainer2.Location = new System.Drawing.Point(0, 0);
            this.splitContainer2.Name = "splitContainer2";
            // 
            // splitContainer2.Panel1
            // 
            this.splitContainer2.Panel1.Controls.Add(this.btnSelect);
            // 
            // splitContainer2.Panel2
            // 
            this.splitContainer2.Panel2.Controls.Add(this.btnRun);
            this.splitContainer2.Size = new System.Drawing.Size(403, 36);
            this.splitContainer2.SplitterDistance = 296;
            this.splitContainer2.TabIndex = 0;
            // 
            // btnSelect
            // 
            this.btnSelect.Dock = System.Windows.Forms.DockStyle.Fill;
            this.btnSelect.Location = new System.Drawing.Point(0, 0);
            this.btnSelect.Name = "btnSelect";
            this.btnSelect.Size = new System.Drawing.Size(296, 36);
            this.btnSelect.TabIndex = 0;
            this.btnSelect.Text = "Select Files";
            this.btnSelect.UseVisualStyleBackColor = true;
            this.btnSelect.Click += new System.EventHandler(this.btnSelect_Click);
            // 
            // btnRun
            // 
            this.btnRun.Dock = System.Windows.Forms.DockStyle.Fill;
            this.btnRun.Location = new System.Drawing.Point(0, 0);
            this.btnRun.Name = "btnRun";
            this.btnRun.Size = new System.Drawing.Size(103, 36);
            this.btnRun.TabIndex = 0;
            this.btnRun.Text = "Run";
            this.btnRun.UseVisualStyleBackColor = true;
            this.btnRun.Click += new System.EventHandler(this.btnRun_Click);
            // 
            // fmMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(403, 380);
            this.Controls.Add(this.splitContainer1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "fmMain";
            this.Text = "Brawlers Data Load";
            this.Load += new System.EventHandler(this.Form_Load);
            this.splitContainer1.Panel1.ResumeLayout(false);
            this.splitContainer1.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).EndInit();
            this.splitContainer1.ResumeLayout(false);
            this.splitContainer3.Panel1.ResumeLayout(false);
            this.splitContainer3.Panel1.PerformLayout();
            this.splitContainer3.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer3)).EndInit();
            this.splitContainer3.ResumeLayout(false);
            this.splitContainer2.Panel1.ResumeLayout(false);
            this.splitContainer2.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer2)).EndInit();
            this.splitContainer2.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.OpenFileDialog openFileDialog1;
        private System.Windows.Forms.SplitContainer splitContainer1;
        private System.Windows.Forms.ListView lvSelection;
        private System.Windows.Forms.SplitContainer splitContainer2;
        private System.Windows.Forms.Button btnSelect;
        private System.Windows.Forms.Button btnRun;
        private System.Windows.Forms.SplitContainer splitContainer3;
        private System.Windows.Forms.RadioButton rbRunQueries;
        private System.Windows.Forms.RadioButton rbLoadJSON;
        private System.Windows.Forms.Button btnClear;
        private System.Windows.Forms.ColumnHeader col1;
    }
}


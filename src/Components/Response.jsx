import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js'
import { Upload } from 'lucide-react';
import '../CSS/Response.css'

const Response = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const mainData = location.state?.data;
  console.log(mainData);

  const [expense, setExpense] = React.useState(null);
  React.useEffect(() => {
    let value = mainData.expense_analysis.top_categories.map((item) => {
      return item[1];
    })
    let label = mainData.expense_analysis.top_categories.map((item) => {
      return item[0];
    })
    setExpense({
      values: value,
      labels: label
    })
  }, [])
  const [cibilScoreInfo, setCibilScoreInfo] = React.useState(0)
  const cibilScore = async () => {
    const cibilScoreData = await fetch(`https://web-production-556a5.up.railway.app/analyze-cibil/${mainData.session_id}`)
    const cibilScore = await cibilScoreData.json()
    console.log(cibilScore);
    setCibilScoreInfo(cibilScore.cibil_score)
  }
  React.useEffect(() => {
    cibilScore()
  }, [])
  return (
    <main>
      <section className="reupload">
        <div className="left">
          <h2>Financial Dashboard</h2>
          <span>Comprehensive analysis of your financial data with AI-powered insights</span>
        </div>
        <div className="right">
          <button type='button' className='back-to-home' onClick={() => { navigate('/') }}><Upload size={15} /> Upload New Data</button>
        </div>
      </section>

      <section className="data-display">
        <div className="graphs">
          <div className='graph'>
            <Plot
              data={[
                {
                  type: "pie",
                  values: expense ? expense.values : [],
                  labels: expense ? expense.labels : [],
                  textinfo: "label+percent",
                  textposition: "outside",
                  automargin: true
                }]}
              layout={{
                title: 'A Fancy Plot',
                height: 400,
                width: 400,
                margin: { "t": 0, "b": 0, "l": 0, "r": 0 },
                showlegend: false
              }}
            />
          </div>
          <div className="graph">
            <Plot
              data={[{
                domain: { x: [0, 1], y: [0, 1] },
                value: cibilScoreInfo,
                title: { text: "CibilScore" },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 100 },
                gauge: {
                  axis: { range: [300, 900] },
                  bar: { color: "blue" },
                  steps: [
                    { range: [300, 579], color: "green" },
                    { range: [580, 669], color: "lightgreen" },
                    { range: [670, 739], color: "yellow" },
                    { range: [740, 799], color: "orange" },
                    { range: [800, 900], color: "red" }
                  ],
                  threshold: {
                    line: { color: "black", width: 4 },
                    thickness: 0.75,
                    value: cibilScoreInfo
                  }
                }
              }]}
              layout={{
                height: 400,
                width: 400,
              }}
            />
          </div>
        </div>

      </section>
    </main>
  )
}

export default Response
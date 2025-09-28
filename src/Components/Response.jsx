import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { Upload } from 'lucide-react';
import CircularProgress from '@mui/material/CircularProgress';

import '../CSS/Response.css';

const Response = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mainData = location.state?.data;

  // Expense state
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    if (!mainData?.expense_analysis?.top_categories) return;

    const value = mainData.expense_analysis.top_categories.map(item => item[1]);
    const label = mainData.expense_analysis.top_categories.map(item => item[0]);

    setExpense({ values: value, labels: label });
  }, [mainData]);

  // Cibil Score state
  const [cibilScoreInfo, setCibilScoreInfo] = useState(0);

  const fetchCibilScore = async () => {
    if (!mainData?.session_id) return;
    try {
      const res = await fetch(`https://web-production-556a5.up.railway.app/analyze-cibil/${mainData.session_id}`);
      const data = await res.json();
      setCibilScoreInfo(data.cibil_score || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCibilScore();
  }, [mainData]);

  // Tax Analysis state
  const [taxAnalysisInfo, setTaxAnalysisInfo] = useState(null);

  const fetchTaxAnalysis = async () => {
    if (!mainData?.session_id) return;
    try {
      const res = await fetch(`https://web-production-556a5.up.railway.app/analyze-tax/${mainData.session_id}`);
      const data = await res.json();
      setTaxAnalysisInfo(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTaxAnalysis();
  }, [mainData]);

  // Simplified info object for rendering
  const [info, setInfo] = useState({ tax_calculation: null, deduction_optimization: null });

  useEffect(() => {
    if (!taxAnalysisInfo) return;
    const { tax_calculation, deduction_optimization } = taxAnalysisInfo;
    setInfo({ tax_calculation, deduction_optimization });
  }, [taxAnalysisInfo]);

  // Helper function to format rupees
  const formatRupees = (num) => num ? `₹${num.toLocaleString("en-IN")}` : "-";

  return (
    <main>
      <section className="reupload">
        <div className="left">
          <h2>Financial Dashboard</h2>
          <span>Comprehensive analysis of your financial data with AI-powered insights</span>
        </div>
        <div className="right">
          <button type='button' className='back-to-home' onClick={() => navigate('/')}>
            <Upload size={15} /> Upload New Data
          </button>
        </div>
      </section>

      <section className="data-display">
        <div className="graphs">
          {/* Expense Pie Chart */}
          <div className='graph'>
            <Plot
              data={[{
                type: "pie",
                values: expense?.values || [],
                labels: expense?.labels || [],
                textinfo: "label+percent",
                textposition: "outside",
                automargin: true
              }]}
              layout={{
                title: 'Expense Categories',
                height: 400,
                width: 400,
                margin: { t: 0, b: 0, l: 0, r: 0 },
                showlegend: false
              }}
            />
          </div>

          {/* Cibil Score Gauge */}
          <div className="graph">
            <Plot
              data={[{
                domain: { x: [0, 1], y: [0, 1] },
                value: cibilScoreInfo,
                title: { text: "Cibil Score" },
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

        {/* Tax Info */}
        {(!info.tax_calculation || !info.deduction_optimization) ? (
          <CircularProgress size="30px" />
        ) : (
          <div className="tax-info">
            <section>
              <h2>Tax Calculation (New Regime)</h2>
              <ul>
                <li>Total Tax: {formatRupees(info.tax_calculation.new_regime?.total_tax)}</li>
                <li>Effective Tax Rate: {info.tax_calculation.new_regime?.effective_tax_rate}%</li>
                <li>Taxable Income: {formatRupees(info.tax_calculation.new_regime?.taxable_income)}</li>
                <li>Recommended Regime: {info.tax_calculation.new_regime?.recommended_regime}</li>
                <li>Annual Savings Compared to Old Regime: {formatRupees(info.tax_calculation.new_regime?.savings)}</li>
              </ul>
            </section>

            <section>
              <h2>Deduction Optimization</h2>
              <ul>
                {info.deduction_optimization.optimization_suggestions?.map((suggestion, idx) => (
                  <li key={idx}>
                    <strong>{suggestion.section}</strong>
                    <p>{suggestion.suggestion}</p>
                    {suggestion.investment_options?.length > 0 && (
                      <ul>
                        {suggestion.investment_options.map((option, index) => (
                          <li key={index}>{option}</li>
                        ))}
                      </ul>
                    )}
                    <p><em>{suggestion.reasoning}</em></p>
                  </li>
                ))}
                <li>Total Potential Savings: {formatRupees(info.deduction_optimization?.total_potential_savings)}</li>
              </ul>
            </section>
          </div>
        )}
      </section>

      <a href='https://chatbot-ciruwcy3zv9xsqr7qds9la.streamlit.app/' className='ai'>Talk to AI</a>
    </main>
  );
};

export default Response;

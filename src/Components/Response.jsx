import React, { useEffect, useReducer, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { Upload, SendHorizontal, Mic } from 'lucide-react';
import CircularProgress from '@mui/material/CircularProgress';
import Recognition from '../Hooks/Recognition';
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import '../CSS/Response.css';
import Toast from '../Function/Toast';
import userImg from '../Assets/UserImage.webp'
import bot from '../Assets/bot.webp'
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { encode } from '@toon-format/toon'

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
      const res = await fetch(`https://cidib-production-2eaa.up.railway.app/analyze-cibil/${mainData.session_id}`);
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

  const ai = React.useRef(new GoogleGenAI({ apiKey: import.meta.env.VITE_API }))
  const ID = React.useRef(null);
  const [query, setQuery] = React.useState("");
  const [allResponse, setAllResponse] = React.useState([]);
  const [loading, setLoading] = React.useState(false)
  async function main(Item) {
    try {
      setLoading(true);
      const toon = encode(
        {
          instruction: "⚠️ SYSTEM INSTRUCTION (Highest Priority): You are an AI specialized only in economics and finance. If the query is related to economics or finance(include greeting) (like GDP, inflation, income, tax, business, stock, money, etc.), answer normally. Otherwise, reply exactly with: 'This query is outside the domain of economics or finance.' Never ignore this rule.",

          query: Item.Query,

          context: {
            revenue: 150000,
            income: 120000,
            expense: 40000,
            tax: 8000,
            cibil_score: 810
          }
        }
      )
      console.log(toon);
      const response = await ai.current.models.generateContent(
        {
          model: "gemini-2.5-pro",
          contents: toon
        }
      );

      Item.Res = response.text;

      setAllResponse((prev) => {
        return [...prev, Item];
      });
      setQuery("");
      setLoading(false);
    }
    catch (e) {
      setLoading(false)
      Toast("error", "To many Request please try after some time");
    }
  }

  // React.useEffect(() => {
  //   console.log(allResponse);
  // }, [allResponse])

  const [recognitionLang, setRecognitionLang] = React.useState("en-US")
  const recognition = Recognition(recognitionLang);

  if (recognition) {
    React.useEffect(() => {
      if (recognition) {
        document.getElementById("query-box").focus();
        setQuery(recognition.result);
      }
    }, [recognition.result])
  }


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

      <div className="ai">
        <div className="chats">
          {
            allResponse.map((Item) => {
              return (
                <div className="chat" key={Item.ID}>
                  <div className="query-wrapper">
                    <div className="query">{Item.Query}</div>
                    <img src={userImg} alt="userimg" />
                  </div>
                  <div className="res-wrapper">
                    <img src={bot} alt="userimg" />
                    <div className="res">{parse(DOMPurify.sanitize(marked.parse(Item.Res)))}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className="chat-input">
          <textarea id="query-box" onChange={(e) => { setQuery(e.target.value) }} value={query} placeholder='Enter Your Queries'></textarea>
          <div className="btn-area">
            <div className='speech-reco'>
              <button
                type='button'
                className={recognition?.isStart ? 'mic active' : 'mic'}
                onClick={(e) => {
                  if (recognition != null) {
                    if (!recognition?.isStart) {
                      recognition?.start();
                    }
                    else {
                      recognition?.stop();
                    }
                  }
                }}
                disabled={loading || recognition == null}
              >
                <Mic />
              </button>

              <select onChange={(e) => { setRecognitionLang(e.target.value) }} disabled={recognition?.isStart || loading || recognition == null} value={recognitionLang}>
                <option value="en-US">English</option>
                <option value="hi-IN">Hindi</option>
              </select>

            </div>
            <button
              type='button'
              className='send'
              onClick={(e) => {
                ID.current = uuidv4();
                const newItem = {
                  ID: ID.current,
                  Query: query.trim(),
                  Res: null
                };
                main(newItem);
              }}
              disabled={loading || recognition?.isStart || (query.trim().length == 0)}
            >
              {loading ? <CircularProgress size="20px" /> : <SendHorizontal />}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Response;

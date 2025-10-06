import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://func-app-demo-8685.azurewebsites.net'
  : '';

function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [stockSymbol, setStockSymbol] = useState('AAPL');
  const [stockData, setStockData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch health status on component mount
  useEffect(() => {
    fetchHealthStatus();
  }, []);

  const fetchHealthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      setHealthStatus(data);
    } catch (err) {
      console.error('Failed to fetch health status:', err);
    }
  };

  const fetchStockData = async () => {
    if (!stockSymbol.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/stock/${stockSymbol.toUpperCase()}`);
      const data = await response.json();
      
      if (response.ok) {
        setStockData(data);
      } else {
        setError(data.message || 'Failed to fetch stock data');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchStocks = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/stock/search/${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (response.ok) {
        setSearchResults(data);
      } else {
        setError(data.message || 'Failed to search stocks');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStockSelect = (symbol) => {
    setStockSymbol(symbol);
    setSearchResults(null);
    setSearchQuery('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Azure Function App Demo</h1>
        <p>Full-stack serverless application with React + Azure Functions</p>
      </header>

      <main className="App-main">
        {/* Health Status */}
        <section className="card">
          <h2>🏥 System Health</h2>
          {healthStatus ? (
            <div className="health-status">
              <p><strong>Status:</strong> <span className={`status ${healthStatus.status}`}>{healthStatus.status}</span></p>
              <p><strong>Environment:</strong> {healthStatus.environment}</p>
              <p><strong>Node Version:</strong> {healthStatus.nodeVersion}</p>
              <p><strong>Last Updated:</strong> {new Date(healthStatus.timestamp).toLocaleString()}</p>
            </div>
          ) : (
            <p>Loading health status...</p>
          )}
        </section>

        {/* Stock Search */}
        <section className="card">
          <h2>🔍 Stock Search</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Search for stocks (e.g., Apple, Microsoft)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchStocks()}
            />
            <button onClick={searchStocks} disabled={loading}>
              {loading ? '🔄' : '🔍'} Search
            </button>
          </div>

          {searchResults && (
            <div className="search-results">
              <h3>Search Results ({searchResults.results.length})</h3>
              <div className="results-grid">
                {searchResults.results.map((stock, index) => (
                  <div key={index} className="result-item" onClick={() => handleStockSelect(stock.symbol)}>
                    <strong>{stock.symbol}</strong>
                    <p>{stock.shortname || stock.longname}</p>
                    <small>{stock.exchange}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Stock Data */}
        <section className="card">
          <h2>📈 Stock Data</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL, MSFT)"
              value={stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && fetchStockData()}
            />
            <button onClick={fetchStockData} disabled={loading}>
              {loading ? '🔄' : '📊'} Get Data
            </button>
          </div>

          {error && (
            <div className="error">
              ❌ {error}
            </div>
          )}

          {stockData && (
            <div className="stock-data">
              <div className="stock-header">
                <h3>{stockData.quote.shortName || stockData.symbol}</h3>
                <p className="symbol">{stockData.symbol}</p>
              </div>
              
              <div className="price-section">
                <div className="current-price">
                  <span className="price">${stockData.quote.regularMarketPrice?.toFixed(2)}</span>
                  <span className={`change ${stockData.quote.regularMarketChange >= 0 ? 'positive' : 'negative'}`}>
                    {stockData.quote.regularMarketChange >= 0 ? '+' : ''}
                    ${stockData.quote.regularMarketChange?.toFixed(2)} 
                    ({stockData.quote.regularMarketChangePercent?.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="stock-details">
                <div className="detail-row">
                  <span>Open:</span>
                  <span>${stockData.quote.regularMarketOpen?.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span>Previous Close:</span>
                  <span>${stockData.quote.regularMarketPreviousClose?.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span>Day Range:</span>
                  <span>${stockData.quote.regularMarketDayLow?.toFixed(2)} - ${stockData.quote.regularMarketDayHigh?.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span>Volume:</span>
                  <span>{stockData.quote.regularMarketVolume?.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span>Market Cap:</span>
                  <span>${(stockData.quote.marketCap / 1e9)?.toFixed(2)}B</span>
                </div>
              </div>

              {stockData.historical && stockData.historical.length > 0 && (
                <div className="historical-data">
                  <h4>📅 5-Day Historical Data</h4>
                  <div className="historical-table">
                    {stockData.historical.map((day, index) => (
                      <div key={index} className="historical-row">
                        <span className="date">{day.date}</span>
                        <span className="close">${day.close.toFixed(2)}</span>
                        <span className="volume">{day.volume.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* API Endpoints */}
        <section className="card">
          <h2>🔗 Available API Endpoints</h2>
          <div className="endpoints">
            <div className="endpoint">
              <strong>GET</strong> <code>/api/health</code> - System health check
            </div>
            <div className="endpoint">
              <strong>GET</strong> <code>/api/stock/&#123;symbol&#125;</code> - Get stock data
            </div>
            <div className="endpoint">
              <strong>GET</strong> <code>/api/stock/search/&#123;query&#125;</code> - Search stocks
            </div>
            <div className="endpoint">
              <strong>GET/POST</strong> <code>/api/httpTrigger</code> - Basic HTTP trigger
            </div>
            <div className="endpoint">
              <strong>GET/POST/PUT/DELETE</strong> <code>/api/&#123;id?&#125;</code> - Demo CRUD API
            </div>
          </div>
        </section>
      </main>

      <footer className="App-footer">
        <p>Built with ❤️ using React, Azure Functions, and Azure Static Web Apps</p>
        <p>Data powered by yahoo-finance2 • Real-time stock market data</p>
      </footer>
    </div>
  );
}

export default App;
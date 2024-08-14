import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState("03"); // Default March

  useEffect(() => {
    fetchTransactions();
  }, [search, page, month]);

  const fetchTransactions = async () => {
    const response = await axios.get("http://localhost:5000/api/transactions", {
      params: { search, page, per_page: 10, month },
    });
    setTransactions(response.data);
  };

  return (
    <div className="container mt-5 p-4 bg-light rounded">
      <div className="row mb-3">
        <h3 className="mb-4 text-primary">Transcation Table</h3>
        <div className="col-md-6">
          <select
            className="form-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions"
          />
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-warning">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Category</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <button className="btn btn-primary" onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;

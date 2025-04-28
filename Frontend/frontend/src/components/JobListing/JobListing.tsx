import React, { useState } from 'react';
import './jobListing.css';

interface JobOpportunity {
  id: number;
  doctor: string;
  clinic: string;
  name: string;
  specialization: string;
  experience: number;
  availability: boolean;
  available_days: string;
  created_at:string;
}

interface JobListingsDashboardProps {
  jobOpportunities: JobOpportunity[];
}

const JobListingsDashboard: React.FC<JobListingsDashboardProps> = ({ jobOpportunities }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(jobOpportunities.length / itemsPerPage);

  // Calculate current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListings = jobOpportunities.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page navigation
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate stats for the summary cards
  const activeListings = jobOpportunities.filter(listing => listing.availability === true).length;
  const pendingReview = jobOpportunities.filter(listing => listing.visibility === 'private').length;
  const totalApplicants = jobOpportunities.reduce((sum, listing) => sum + listing.no_of_openings, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date'; 
    }
    return date.toISOString().split('T')[0];
  };

  const deleteListing = (id: number) => {

  };

  return (
    <div className="job-listings-container">
      <div className="Listing-header">
      <h1>Associated Doctors</h1>
        <div className="search-new">
          <div className="search-bar">
            <input type="text" placeholder="Search listings..." />
          </div>

        </div>
      </div>

      <div className="listings-table">
        <div className="table-header">
          <div className="col position">Name</div>
          <div className="col status">Status</div>
          <div className="col views">Experience</div>
          <div className="col applicants">Available</div>
          <div className="col posted-date">Joined from</div>
          <div className="col actions">ACTIONS</div>
        </div>

        {currentListings.map((listing) => (
          <div className="table-row" key={listing.id}>
            <div className="row position">
              <div className="position-title">{listing.name}</div>
              <div className="position-details">
                {listing.specialization} • Bengalore
              </div>
            </div>
            <div className="col status">
            <span className={`status-badge ${listing.availability ? "active" : "pending"}`}>
                {listing.availability ? "Available" : "Unavailable"}
              </span>
            </div>
            <div className="col views">{listing.experience.toLocaleString()+ ' Years'}</div>
            <div className="col applicants">{listing.available_days}</div>
            <div className="col posted-date">{formatDate(listing.created_at)}</div>
            <div className="col actions">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn" onClick={() => deleteListing(listing.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-info">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, jobOpportunities.length)} of {jobOpportunities.length} entries
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="pagination-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-number total">{jobOpportunities.length}</div>
          <div className="card-label">Total Doctors</div>
        </div>
        <div className="summary-card">
          <div className="card-number active">{activeListings}</div>
          <div className="card-label">Available Doctors</div>
        </div>
        <div className="summary-card">
          <div className="card-number pending">{pendingReview}</div>
          <div className="card-label">Pending Review</div>
        </div>
        <div className="summary-card">
          <div className="card-number applicants">{totalApplicants}</div>
          <div className="card-label">Total Applicants</div>
        </div>
      </div>
    </div>
  );
};

export default JobListingsDashboard;
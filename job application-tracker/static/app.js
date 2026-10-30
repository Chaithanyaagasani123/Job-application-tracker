const API_URL = 'http://127.0.0.1:5000/api/jobs';

// Fetch data on fresh load
document.addEventListener("DOMContentLoaded", fetchJobs);

async function fetchJobs() {
    const res = await fetch(API_URL);
    const jobs = await res.json();
    
    // Clear out columns
    document.querySelectorAll('.cards-container').forEach(el => el.innerHTML = '');

    jobs.forEach(job => {
        const column = document.getElementById(job.status).querySelector('.cards-container');
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${job.job_title}</h3>
            <p>🏢 ${job.company_name}</p>
            <select onchange="updateStatus(${job.id}, this.value)">
                <option value="Applied" ${job.status === 'Applied' ? 'selected' : ''}>Applied</option>
                <option value="Interviewing" ${job.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                <option value="Rejected" ${job.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
            </select>
        `;
        column.appendChild(card);
    });
}

// Add Job form handling
document.getElementById('jobForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const company_name = document.getElementById('company').value;
    const job_title = document.getElementById('title').value;

    try {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            company_name: company_name,
            job_title: job_title
        })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.error || "Failed to add job");
        return;
    }

    alert("Job added successfully!");

    document.getElementById('jobForm').reset();

    fetchJobs();

} catch (error) {
    console.error("Error:", error);
    alert("Cannot connect to Flask server");
} // Refresh columns
});

// Update dynamic card dropdown status row pipeline
async function updateStatus(id, newStatus) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    fetchJobs(); // Instantly move the item across elements natively
}

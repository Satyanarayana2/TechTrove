fetch('/api/technews')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('technews-container');
    if (!container) return;

    // Render summary
    if (data.summary) {
      const summaryDiv = document.createElement('div');
      summaryDiv.className = 'technews-summary';
      summaryDiv.textContent = data.summary;
      container.appendChild(summaryDiv);
    }

    // Render news items in a row
    const newsRow = document.createElement('div');
    newsRow.className = 'technews-row';
    const banners = [
      '../content resources/technews1.svg',
      '../content resources/technews2.svg',
      '../content resources/technews3.svg',
      '../content resources/technews4.svg'
    ];
    (data.news || []).forEach((item, idx) => {
      const newsDiv = document.createElement('div');
      newsDiv.className = 'technews-card';
      const banner = '../content resources/background.png';
      newsDiv.innerHTML = `
        <img src="${banner}" alt="news banner" style="width:100%;height:90px;object-fit:cover;border-radius:10px 10px 0 0; margin-bottom:1rem;">
        <h3>${item.headline || ''}</h3>
        <p>${item.main_content || ''}</p>
        ${item.source_link ? `<a href="${item.source_link}" target="_blank">Read more &rarr;</a>` : ''}
      `;
      newsRow.appendChild(newsDiv);
    });
    container.appendChild(newsRow);
  });

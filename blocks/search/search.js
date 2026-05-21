export default function decorate(block) {
  block.innerHTML = `
    <div class="search-input-wrapper">
      <input type="text" placeholder="Search..." aria-label="Search">
      <button type="button">Search</button>
    </div>
    <div class="search-results"></div>
  `;

  const input = block.querySelector('input');
  const button = block.querySelector('button');
  const resultsContainer = block.querySelector('.search-results');

  async function performSearch(query) {
    if (!query.trim()) {
      resultsContainer.innerHTML = '';
      return;
    }

    resultsContainer.innerHTML = '<p>Searching...</p>';

    try {
      const response = await fetch('/query-index.json');
      const data = await response.json();

      const results = data.data.filter((item) => {
        const searchText = query.toLowerCase();
        return (
          item.title?.toLowerCase().includes(searchText)
          || item.description?.toLowerCase().includes(searchText)
        );
      });

      if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
      }

      resultsContainer.innerHTML = results.map((item) => `
        <div class="search-result-item">
          <h3><a href="${item.path}">${item.title}</a></h3>
          <p>${item.description || ''}</p>
        </div>
      `).join('');
    } catch {
      resultsContainer.innerHTML = '<p>Search is not available right now.</p>';
    }
  }

  button.addEventListener('click', () => {
    performSearch(input.value);
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch(input.value);
    }
  });
}

async function fetchRealDogNews() {
  const query = encodeURIComponent('dog rescue OR "hero dog" OR "dog reunited"');
  const url = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const res = await fetch(url);
    const xml = await res.text();
    
    // Simple regex extraction of RSS items
    const items = [];
    const itemRegex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<source[^>]*>(.*?)<\/source>[\s\S]*?<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
      items.push({
        title: match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/&amp;/g, '&'),
        link: match[2],
        pubDate: match[3],
        source: match[4].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1'),
      });
    }

    console.log('=== REAL DOG NEWS DISCOVERED FROM WEB ===\n');
    console.log(JSON.stringify(items, null, 2));
  } catch (err) {
    console.error('Error fetching news:', err);
  }
}

fetchRealDogNews();

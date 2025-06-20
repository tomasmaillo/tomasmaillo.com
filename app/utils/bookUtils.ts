interface BookData {
  title: string
  authors?: string[]
  description?: string
  imageUrl?: string
}

export async function getBookData(query: string): Promise<BookData> {
  // For Open Library, we'll use the ISBN format
  // We'll assume the query is an ISBN for now
  const isbn = query.replace(/[^0-9X]/g, '') // Remove any non-ISBN characters

  // Open Library Covers API URL with correct pattern
  const imageUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`

  // For now, we'll return just the basic data since Open Library doesn't provide
  // title/author/description through their covers API
  return {
    title: query,
    imageUrl,
  }
}

import { useState } from "react";
import { useSelector } from "react-redux";

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const products = useSelector((state) => state.products.products);

  // Trim and filter products based on input
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <>
      <h1>Search Products</h1>
      
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Products..."
        style={{ padding: '8px', width: '250px', marginRight: '10px' }}
      />

      {/* Show all or filtered */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <li key={item.id} style={{ marginBottom: '20px' }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '150px', height: 'auto', borderRadius: '8px' }}
              />
              <p>{item.name}</p>
            </li>
          ))
        ) : (
          <p style={{color : 'red'}}>No products found.</p>
        )}
      </ul>
    </>
  );
}

export default Home;

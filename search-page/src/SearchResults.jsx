// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";

// function SearchResults() {
//   const { query } = useParams();
//   const products = useSelector((state) => state.products.products);

//   const results = products.filter((item) =>
//     item.name.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <>
//       <h2>Results for: <span style={{ color: 'green' }}>{query}</span></h2>

//       {results.length > 0 ? (
//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {results.map((item) => (
//             <li key={item.id} style={{ marginBottom: '20px' }}>
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 style={{ width: '150px', height: 'auto', borderRadius: '8px' }}
//               />
//               <p>{item.name}</p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No products found.</p>
//       )}
//     </>
//   );
// }

// export default SearchResults;

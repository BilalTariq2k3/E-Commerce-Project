import Image from "next/image";

export default function DashboardProductCard({data})
{


    return (

  <div className="card mb-3" style={{ width: "540px" , borderRadius: "20px",    }}>
   <div className="row g-0 align-items-center">
     <div className="col-md-7">
        <Image style={{  borderRadius: "20px",    }}
             src={data.image} // fixed typo here
             className="img-fluid  px-2 py-2"
             alt={data.name || "Product"}
             width={200}
             height={200}
           />
     </div>
     <div className="col-md-4">
       <div className="card-body">
         <h5 className="card-title">{data.name}</h5>
         <p className="card-text">{data.price}$</p>
       </div>
     </div>
   </div>
 </div>

    );
}
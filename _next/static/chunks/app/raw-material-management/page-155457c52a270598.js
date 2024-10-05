(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[605],{7522:function(e,a,t){Promise.resolve().then(t.bind(t,3848))},3848:function(e,a,t){"use strict";t.r(a),t.d(a,{default:function(){return d}});var r=t(7437),n=t(2265),l=e=>{let{onMaterialAdded:a}=e,[t,l]=(0,n.useState)({name:"",totalQuantity:0,stockDate:"",addedQuantity:0,addDate:"",removedQuantity:0,removeDate:""}),s=e=>{let{name:a,value:r}=e.target,n="totalQuantity"===a||"addedQuantity"===a||"removedQuantity"===a?Number(r):r;l({...t,[a]:n})},d=async e=>{e.preventDefault();let r=t.totalQuantity+t.addedQuantity-t.removedQuantity;await fetch("/api/raw-material",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...t,remainingQuantity:r})}),a(),l({name:"",totalQuantity:0,stockDate:"",addedQuantity:0,addDate:"",removedQuantity:0,removeDate:""})};return(0,r.jsx)("div",{className:"flex justify-center items-center min-h-screen bg-gray-100 p-6",children:(0,r.jsxs)("form",{onSubmit:d,className:"bg-white shadow-lg rounded-lg p-8 max-w-lg w-full",children:[(0,r.jsx)("h2",{className:"text-2xl font-semibold text-center mb-6",children:"Raw Material Management"}),(0,r.jsxs)("div",{className:"space-y-4",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-gray-700",children:"Raw Material Name"}),(0,r.jsx)("input",{type:"text",name:"name",value:t.name,onChange:s,className:"w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400",required:!0})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-gray-700",children:"Total Raw Material Quantity (in Kg)"}),(0,r.jsx)("input",{type:"number",name:"totalQuantity",value:t.totalQuantity,onChange:s,className:"w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400",required:!0,min:"0"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-gray-700",children:"Raw Material Stock Date"}),(0,r.jsx)("input",{type:"date",name:"stockDate",value:t.stockDate,onChange:s,className:"w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400",required:!0})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-gray-700",children:"Add Raw Material Quantity"}),(0,r.jsx)("input",{type:"number",name:"addedQuantity",value:t.addedQuantity,onChange:s,className:"w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400",required:!0,min:"0"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-gray-700",children:"Add Raw Material Quantity Date"}),(0,r.jsx)("input",{type:"date",name:"addDate",value:t.addDate,onChange:s,className:"w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400",required:!0})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-gray-700",children:"Remove Raw Material Quantity"}),(0,r.jsx)("input",{type:"number",name:"removedQuantity",value:t.removedQuantity,onChange:s,className:"w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400",required:!0,min:"0"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-gray-700",children:"Remove Raw Material Quantity Date"}),(0,r.jsx)("input",{type:"date",name:"removeDate",value:t.removeDate,onChange:s,className:"w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400",required:!0})]})]}),(0,r.jsx)("button",{type:"submit",className:"mt-6 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200",children:"Submit"})]})})},s=e=>{let{refreshKey:a}=e,[t,l]=(0,n.useState)([]),s=async()=>{let e=await fetch("/api/raw-material");l((await e.json()).data)};return(0,n.useEffect)(()=>{s()},[a]),(0,r.jsx)("div",{className:"overflow-x-auto mt-8",children:(0,r.jsxs)("table",{className:"min-w-full bg-white border border-gray-300",children:[(0,r.jsx)("thead",{children:(0,r.jsxs)("tr",{className:"bg-gray-200 text-gray-700",children:[(0,r.jsx)("th",{className:"py-2 px-4 border-b",children:"Raw Material Name"}),(0,r.jsx)("th",{className:"py-2 px-4 border-b",children:"Total Quantity (Kg)"}),(0,r.jsx)("th",{className:"py-2 px-4 border-b",children:"Stock Date"}),(0,r.jsx)("th",{className:"py-2 px-4 border-b",children:"Added Quantity"}),(0,r.jsx)("th",{className:"py-2 px-4 border-b",children:"Add Date"}),(0,r.jsx)("th",{className:"py-2 px-4 border-b",children:"Removed Quantity"}),(0,r.jsx)("th",{className:"py-2 px-4 border-b",children:"Remove Date"}),(0,r.jsx)("th",{className:"py-2 px-4 border-b",children:"Remaining Quantity"})]})}),(0,r.jsx)("tbody",{children:t.length>0?t.map(e=>(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{className:"py-2 px-4 border-b text-center",children:e.name}),(0,r.jsx)("td",{className:"py-2 px-4 border-b text-center",children:e.totalQuantity}),(0,r.jsx)("td",{className:"py-2 px-4 border-b text-center",children:new Date(e.stockDate).toLocaleDateString()}),(0,r.jsx)("td",{className:"py-2 px-4 border-b text-center",children:e.addedQuantity}),(0,r.jsx)("td",{className:"py-2 px-4 border-b text-center",children:new Date(e.addDate).toLocaleDateString()}),(0,r.jsx)("td",{className:"py-2 px-4 border-b text-center",children:e.removedQuantity}),(0,r.jsx)("td",{className:"py-2 px-4 border-b text-center",children:new Date(e.removeDate).toLocaleDateString()}),(0,r.jsx)("td",{className:"py-2 px-4 border-b text-center",children:e.remainingQuantity})]},e._id)):(0,r.jsx)("tr",{children:(0,r.jsx)("td",{colSpan:"8",className:"py-2 px-4 border-b text-center",children:"No data available"})})})]})})},d=()=>{let[e,a]=(0,n.useState)(0);return(0,r.jsxs)("div",{className:"p-8",children:[(0,r.jsx)("h1",{className:"text-3xl font-bold mb-4",children:"Raw Material Management"}),(0,r.jsx)(l,{onMaterialAdded:()=>{a(e=>e+1)}}),(0,r.jsx)(s,{refreshKey:e})," "]})}}},function(e){e.O(0,[971,117,744],function(){return e(e.s=7522)}),_N_E=e.O()}]);
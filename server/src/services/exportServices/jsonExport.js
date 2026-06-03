

export const jsonExport= (content)=>{
    if(content.reviewed_data){
        return JSON.stringify(content.reviewed_data, null, 2);//stringify(value, replacer, space(indention) )
        
    }
    return JSON.stringify(content.extracted_data, null, 2);//stringify(value, replacer, space(indention )
    
}

//!stringify(value, null, 2)
//!Means: don't need replacer but with 2 levels indent
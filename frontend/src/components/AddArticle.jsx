import { useForm } from "react-hook-form";

function AddArticle(){

  const {register,handleSubmit,formState:{errors}} = useForm();

  const onSubmit = (data)=>{
    console.log(data);
  }

  return(

    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-gray-200 p-10 w-700px rounded">

        <h1 className="text-center text-2xl mb-10 font-semibold">
          AddArticle.jsx
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Title */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Title"
              {...register("title",{required:true})}
              className="bg-gray-300 p-3 w-500px"
            />
          </div>

          {errors.title && <p className="text-red-500 text-center">Title required</p>}

          {/* Category */}
          <div className="flex justify-center">
            <select
              {...register("category",{required:true})}
              className="bg-gray-300 p-3 w-500px"
            >
              <option value="">Category</option>
              <option>Technology</option>
              <option>Education</option>
              <option>Sports</option>
              <option>Health</option>
            </select>
          </div>

          {errors.category && <p className="text-red-500 text-center">Category required</p>}

          {/* Content */}
          <div className="flex justify-center">
            <textarea
              rows="5"
              placeholder="Content"
              {...register("content",{required:true})}
              className="bg-gray-300 p-3 w-500px"
            />
          </div>

          {errors.content && <p className="text-red-500 text-center">Content required</p>}

          {/* Button */}
          <div className="flex justify-center">
            <button className="bg-sky-500 text-white px-10 py-3 rounded">
              Publish Article
            </button>
          </div>

        </form>

      </div>

    </div>

  )
}

export default AddArticle
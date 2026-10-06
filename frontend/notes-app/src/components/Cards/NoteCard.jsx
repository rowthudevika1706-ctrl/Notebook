// import React from 'react'
// import moment from "moment"
// import {MdOutlinePushPin} from "react-icons/md"
// import {MdCreate,MdDelete} from "react-icons/md"
// const NoteCard = ({title,date,content,tags,isPinned,onEdit,onDelete,onPinNote,}) => {
//   return (
//     <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
//       <div className="flex items-center justify-between ">
//         <div>
//             <h6 className='text-sm font-medium'>{title}</h6>
//             <span className="text-xs text-slate-500">{moment(date).format('DD MMM YYYY')}</span>
//         </div>

//         <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary':'text-slate-300'}`} onClick={onPinNote}/>
//       </div>
//       <p className="text-xs text-slate-600 mt-2 ">{content?.slice(0,60)}</p>
//       <div className="flex items-center justify-between mt-2">
//         <div className="text-xs text-slate-500">{tags.map((item)=>`#${item}`)}</div>
//         <div className="flex items-center gap-2">
//             <MdCreate 
//             className='icon-btn hover:text-green-600' onClick={onEdit}
//             />

//             <MdDelete 
//             className='icon-btn hover:text-red-500' onClick={onDelete}/>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default NoteCard

import React, { useState } from 'react'
import moment from "moment"
import { MdOutlinePushPin } from "react-icons/md"
import { MdCreate, MdDelete, MdVisibility, MdClose } from "react-icons/md"

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {

  const [showNote, setShowNote] = useState(false);

  return (
    <>
      {/* Note Card */}
      <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>

        <div className="flex items-center justify-between">
          <div>
            <h6 className='text-sm font-medium'>{title}</h6>
            <span className="text-xs text-slate-500">
              {moment(date).format('DD MMM YYYY')}
            </span>
          </div>

          <MdOutlinePushPin
            className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`}
            onClick={onPinNote}
          />
        </div>

        <p className="text-xs text-slate-600 mt-2">
          {content?.slice(0, 60)}
          {content?.length > 60 && "..."}
        </p>

        <div className="flex items-center justify-between mt-2">

          <div className="text-xs text-slate-500">
            {tags.map((item) => `#${item} `)}
          </div>

          <div className="flex items-center gap-2">

            {/* View */}
            <MdVisibility
              className='icon-btn hover:text-blue-600'
              onClick={() => setShowNote(true)}
            />

            {/* Edit */}
            <MdCreate
              className='icon-btn hover:text-green-600'
              onClick={onEdit}
            />

            {/* Delete */}
            <MdDelete
              className='icon-btn hover:text-red-500'
              onClick={onDelete}
            />

          </div>
        </div>
      </div>


      {/* View Note Modal */}
      {showNote && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg w-[90%] md:w-[60%] max-h-[80vh] p-6 shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">

              <div>
                <h2 className="text-lg font-semibold">
                  {title}
                </h2>

                <span className="text-xs text-slate-500">
                  {moment(date).format('DD MMM YYYY')}
                </span>
              </div>

              <MdClose
                className="icon-btn text-xl"
                onClick={() => setShowNote(false)}
              />

            </div>


            {/* Complete Note Content */}
            <div className="text-sm text-slate-700 whitespace-pre-wrap overflow-y-auto max-h-[55vh]">
              {content}
            </div>


            {/* Tags */}
            <div className="mt-4 text-xs text-slate-500">
              {tags.map((item) => `#${item} `)}
            </div>

          </div>

        </div>
      )}

    </>
  )
}

export default NoteCard

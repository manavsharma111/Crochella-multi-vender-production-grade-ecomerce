import { Trash2, Bell } from "lucide-react"
import BrutalistCard from "./BrutalistCard"

const NotificationCard = ({ notification, onDelete, className = "" }) => {
  return (
    <BrutalistCard
      className={`flex justify-between items-start p-5 transition-all group ${!notification.read ? "border-[#ff007f]" : ""} ${className}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-2 bg-[#222] border-2 ${!notification.read ? "border-[#ff007f]" : "border-gray-800"} shadow-[2px_2px_0px_#000] rounded-lg mt-1 shrink-0`}
        >
          <Bell
            size={18}
            className={!notification.read ? "text-[#ff007f]" : "text-gray-400"}
          />
        </div>
        <div>
          <h4
            className={`text-sm font-bold uppercase tracking-widest mb-1 ${!notification.read ? "text-white" : "text-gray-300"}`}
          >
            {notification.title}
          </h4>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-md">
            {notification.message}
          </p>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">
            {notification.time}
          </p>
        </div>
      </div>
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            onDelete(notification.id)
          }}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all md:opacity-0 group-hover:opacity-100"
          title="Delete Notification"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </BrutalistCard>
  )
}

export default NotificationCard

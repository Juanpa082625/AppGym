import { Inbox, Users, Dumbbell, CreditCard, UserCircle } from 'lucide-react'

interface EmptyStateProps {
  icon?: 'inbox' | 'users' | 'dumbbell' | 'creditcard' | 'user'
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ 
  icon = 'inbox', 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  const getIcon = () => {
    const iconClass = "w-16 h-16 text-gray-300"
    switch (icon) {
      case 'users':
        return <Users className={iconClass} />
      case 'dumbbell':
        return <Dumbbell className={iconClass} />
      case 'creditcard':
        return <CreditCard className={iconClass} />
      case 'user':
        return <UserCircle className={iconClass} />
      default:
        return <Inbox className={iconClass} />
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
        {title}
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-md mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-[#1E1E1E] hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

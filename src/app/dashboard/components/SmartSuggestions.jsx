// components/SmartSuggestions.jsx
import React from 'react';
import Card from './Card';
import Badge from './Badge';

const SmartSuggestions = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  badge, 
  badgeVariant = 'info',
  actionText,
  onAction,
  iconBg = 'bg-blue-50',
  iconColor = 'text-blue-600'
}) => (
  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onAction}>
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-900 text-sm">{title}</h3>
          {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        </div>
        <p className="text-xs text-gray-600 mb-2">{subtitle}</p>
        <p className="text-xs text-gray-500">{actionText}</p>
      </div>
    </div>
  </Card>
);

export default SmartSuggestions;
import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LanguageSwitcher = ({ currentLanguage, onLanguageChange }) => {
  const languages = [
    {
      code: 'fr',
      name: 'Français',
      flag: '🇫🇷',
      nativeName: 'Français'
    },
    {
      code: 'en',
      name: 'English',
      flag: '🇬🇧',
      nativeName: 'English'
    }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        className="flex items-center space-x-2 px-3 py-2 h-10 border border-border hover:bg-muted"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium">{currentLang.nativeName}</span>
        <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
      </Button>

      {/* Dropdown Menu */}
      <div className="absolute top-full left-0 mt-1 w-full min-w-[140px] bg-popover border border-border rounded-lg shadow-prominent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => onLanguageChange(language.code)}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-muted transition-colors
                ${currentLanguage === language.code ? 'bg-muted text-primary font-medium' : 'text-popover-foreground'}
              `}
            >
              <span className="text-base">{language.flag}</span>
              <span>{language.nativeName}</span>
              {currentLanguage === language.code && (
                <Icon name="Check" size={14} className="ml-auto text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
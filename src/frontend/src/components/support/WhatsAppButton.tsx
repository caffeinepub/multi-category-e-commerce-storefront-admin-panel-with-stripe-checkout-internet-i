import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SUPPORT_CONFIG } from '../../config/support';

interface WhatsAppButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
}

export default function WhatsAppButton({ variant = 'default' }: WhatsAppButtonProps) {
  const handleClick = () => {
    const url = `https://wa.me/${SUPPORT_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(SUPPORT_CONFIG.whatsappMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <Button variant={variant} onClick={handleClick} className="gap-2">
      <MessageCircle className="h-4 w-4" />
      WhatsApp Support
    </Button>
  );
}

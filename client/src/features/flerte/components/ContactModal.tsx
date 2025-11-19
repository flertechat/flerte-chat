import { memo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Send, User, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContactModal = memo(({ open, onOpenChange }: ContactModalProps) => {
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Contato de ${contactForm.name}`);
    const body = encodeURIComponent(
      `Nome: ${contactForm.name}\nTelefone: ${contactForm.phone}\nEmail: ${contactForm.email}\n\nMensagem:\n${contactForm.message}`
    );

    window.location.href = `mailto:pauloromulo2000k@gmail.com?subject=${subject}&body=${body}`;

    toast.success("Abrindo seu cliente de email...");
    onOpenChange(false);
    setContactForm({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Entre em Contato
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Preencha o formulário abaixo e entraremos em contato em breve!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Nome completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Seu nome"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Telefone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                required
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                required
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="seu@email.com"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Mensagem</label>
            <Textarea
              required
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              placeholder="Como podemos ajudar?"
              className="min-h-[120px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-6"
          >
            <Send className="w-5 h-5 mr-2" />
            Enviar Mensagem
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
});

ContactModal.displayName = "ContactModal";

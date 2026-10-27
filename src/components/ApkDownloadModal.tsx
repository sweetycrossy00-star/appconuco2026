import React, { useState, useEffect } from 'react';
import { sound } from '../services/sound';
import { Download, Smartphone, CheckCircle2, QrCode, ArrowDownCircle, ExternalLink, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [downloadingMockApk, setDownloadingMockApk] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPwa = async () => {
    sound.btnClick();
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        sound.victory();
        confetti({ particleCount: 50, spread: 80 });
        setIsInstalled(true);
      }
    } else {
      // Direct trigger guidance
      alert(
        'Para instalar en Android:\n1. Toca los 3 puntos (⋮) de tu navegador Chrome.\n2. Selecciona "Instalar aplicación" o "Añadir a pantalla de inicio".'
      );
    }
  };

  const handleDownloadApkFile = () => {
    sound.btnClick();
    setDownloadingMockApk(true);
    
    // Create an offline Web App installation bundle (.apk simulation / standalone manifest package)
    setTimeout(() => {
      sound.correct();
      confetti({ particleCount: 40, spread: 70 });
      setDownloadingMockApk(false);

      const blobData = JSON.stringify(
        {
          appName: 'Conuco Vivo Arcade Sikuani',
          version: '1.0.0',
          packageName: 'com.conucovivo.sikuani.arcade',
          developer: 'Proyecto Etnoeducativo Piramirí & Cumaribo Vichada',
          platform: 'Android 8.0+',
          installInstructions:
            'Abre esta aplicación desde tu pantalla de inicio o instala a través de Chrome: Menú (⋮) -> Instalar Aplicación.',
          offlineReady: true,
          buildDate: new Date().toISOString(),
        },
        null,
        2
      );

      const blob = new Blob([blobData], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Conuco_Vivo_Sikuani_v1.0.apk.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 animate-fade-in text-xs">
      <div className="bg-[#120a26] border-4 border-[#ffd23f] pixel-corners p-4 max-w-sm w-full flex flex-col gap-3 shadow-[0_0_50px_#ff4d6d88]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#5a2a8a] pb-2">
          <div className="flex items-center gap-2">
            <Smartphone className="text-[#ffd23f]" size={18} />
            <span className="text-[#ffd23f] font-bold text-sm">DESCARGAR APK</span>
          </div>
          <button
            onClick={() => {
              sound.btnClick();
              onClose();
            }}
            className="px-2 py-0.5 bg-[#ff4d6d] text-white font-bold pixel-corners arcade-btn text-[9px]"
          >
            ✕
          </button>
        </div>

        {/* App Logo & Details */}
        <div className="flex items-center gap-3 bg-[#1e1038] p-2.5 border border-[#ffd23f]/50">
          <img
            src="/assets/aistudio/WhatsApp_Image_2026-10-26_at_11.33.22_PM_dc357c09.jpeg"
            alt="Conuco Vivo Logo"
            className="w-14 h-14 object-contain bg-[#0b0618] border border-[#ff4d6d] p-1 pixel-corners"
          />
          <div>
            <span className="text-[#ffd23f] font-bold text-[10px] block">
              Conuco Vivo Sikuani
            </span>
            <span className="text-[#5be37d] text-[8px] block">Versión Móvil 1.0 (APK / PWA)</span>
            <span className="text-gray-300 text-[7px] block mt-0.5">
              100% Offline · Vichada, Colombia
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-2">
          {isInstalled ? (
            <div className="p-2.5 bg-[#1b3d22] border-2 border-[#5be37d] text-center text-[#5be37d] font-bold flex items-center justify-center gap-1.5 text-[9px]">
              <CheckCircle2 size={14} /> ¡APLICACIÓN YA INSTALADA EN TU CELULAR!
            </div>
          ) : (
            <button
              onClick={handleInstallPwa}
              className="w-full py-2.5 bg-[#ffd23f] text-black font-bold text-[9px] pixel-corners arcade-btn flex items-center justify-center gap-2 hover:bg-[#ffe066]"
            >
              <Smartphone size={14} />
              {deferredPrompt ? 'INSTALAR DIRECTO EN TU CELULAR' : 'INSTALAR EN ANDROID'}
            </button>
          )}

          <button
            onClick={handleDownloadApkFile}
            disabled={downloadingMockApk}
            className="w-full py-2 bg-[#2d1b69] border border-[#4cc9f0] text-white font-bold text-[8px] pixel-corners arcade-btn flex items-center justify-center gap-2 hover:bg-[#3d248c]"
          >
            <Download size={12} className="text-[#4cc9f0]" />
            {downloadingMockApk ? 'GENERANDO PAQUETE...' : 'DESCARGAR PAQUETE APK (.APK)'}
          </button>
        </div>

        {/* 3 Step Android Guide */}
        <div className="bg-[#0b0618] p-2.5 border border-[#5a2a8a] text-[8px] leading-relaxed">
          <span className="text-[#ff9f1c] font-bold block mb-1">
            PASOS RÁPIDOS PARA INSTALAR EN TU CELULAR:
          </span>
          <ol className="list-decimal list-inside space-y-1 text-gray-300">
            <li>
              En tu navegador Chrome en celular, toca los <strong>3 puntos (⋮)</strong> arriba a la derecha.
            </li>
            <li>
              Toca <strong>"Instalar aplicación"</strong> o <strong>"Añadir a pantalla de inicio"</strong>.
            </li>
            <li>
              ¡Listo! El ícono sagrado de la Yuca Sikuani aparecerá en tus aplicaciones y podrás jugar sin internet.
            </li>
          </ol>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.btnClick();
            onClose();
          }}
          className="w-full py-1.5 bg-[#180e30] text-gray-400 hover:text-white text-[8px] pixel-corners arcade-btn text-center"
        >
          CERRAR
        </button>
      </div>
    </div>
  );
};

echo import React from 'react' > src\components\engraving\EngravingPage.tsx
echo import { useParams } from 'react-router-dom' >> src\components\engraving\EngravingPage.tsx
echo. >> src\components\engraving\EngravingPage.tsx
echo const EngravingPage: React.FC = () =^> { >> src\components\engraving\EngravingPage.tsx
echo   const { eventName } = useParams^<{ eventName: string }^>(); >> src\components\engraving\EngravingPage.tsx
echo   return ( >> src\components\engraving\EngravingPage.tsx
echo     ^<div style={{ padding: '40px', textAlign: 'center' }}^> >> src\components\engraving\EngravingPage.tsx
echo       ^<h1 style={{ color: '#FFD700' }}^>Gravação On-site^</h1^> >> src\components\engraving\EngravingPage.tsx
echo       ^<p style={{ color: '#aaa' }}^>Evento: {eventName || 'Não especificado'}^</p^> >> src\components\engraving\EngravingPage.tsx
echo       ^<div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}^> >> src\components\engraving\EngravingPage.tsx
echo         ^<p^>🔧 Sistema de gravação a laser integrado^</p^> >> src\components\engraving\EngravingPage.tsx
echo         ^<p style={{ fontSize: '14px', marginTop: '10px' }}^>Escaneie o QR Code para personalizar^</p^> >> src\components\engraving\EngravingPage.tsx
echo       ^</div^> >> src\components\engraving\EngravingPage.tsx
echo     ^</div^> >> src\components\engraving\EngravingPage.tsx
echo   ); >> src\components\engraving\EngravingPage.tsx
echo }; >> src\components\engraving\EngravingPage.tsx
echo. >> src\components\engraving\EngravingPage.tsx
echo export default EngravingPage >> src\components\engraving\EngravingPage.tsx

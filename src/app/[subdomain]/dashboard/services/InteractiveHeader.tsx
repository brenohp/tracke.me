"use client"; // A interatividade fica isolada aqui

import { useState } from 'react';

export default function InteractiveHeader() {
  const [menuAberto, setMenuAberto] = useState(false);
  return <header onClick={() => setMenuAberto(!menuAberto)}>Meu Header Interativo</header>;
}
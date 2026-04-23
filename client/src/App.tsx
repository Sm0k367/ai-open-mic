import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Users, Play, X, ThumbsUp, Zap, Heart, Laugh, Star, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Guest {
  id: number;
  name: string;
  handle: string;
  status: 'waiting' | 'approved' | 'onstage';
  avatarColor: string;
  isMuted?: boolean;
}

interface Reaction {
  id: number;
  emoji: string;
  count: number;
}

interface FlyingReaction {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
}

interface ShowcaseItem {
  id: number;
  title: string;
  creator: string;
  description: string;
  emoji: string;
  link: string;
}

const mockGuests: Guest[] = [
  { id: 1, name: "NeuralNadia", handle: "@nadia_ai", status: 'waiting', avatarColor: 'bg-cyan-500', isMuted: false },
  { id: 2, name: "PromptPirate", handle: "@captainprompt", status: 'approved', avatarColor: 'bg-purple-500', isMuted: false },
  { id: 3, name: "GroksGhost", handle: "@ghostgrok", status: 'waiting', avatarColor: 'bg-pink-500', isMuted: true },
];

const initialReactions: Reaction[] = [
  { id: 1, emoji: '🔥', count: 124 },
  { id: 2, emoji: '👏', count: 87 },
  { id: 3, emoji: '🤖', count: 65 },
  { id: 4, emoji: '🌟', count: 42 },
  { id: 5, emoji: '❤️', count: 156 },
];

const showcaseItems: ShowcaseItem[] = [
  { 
    id: 1, 
    title: "Synthwave Saga", 
    creator: "by @bytebard", 
    description: "AI generated cyberpunk opera", 
    emoji: "🎸", 
    link: "#" 
  },
  { 
    id: 2, 
    title: "Neural Haiku Battle", 
    creator: "by @haikuhero", 
    description: "Live LLM poetry slam", 
    emoji: "📜", 
    link: "#" 
  },
  { 
    id: 3, 
    title: "Meme Genesis", 
    creator: "by @dalledev", 
    description: "Real-time AI meme creation", 
    emoji: "😂", 
    link: "#" 
  },
];

export default function AiOpenMic() {
  const [guests, setGuests] = useState<Guest[]>(mockGuests);
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);
  const [flyingReactions, setFlyingReactions] = useState<FlyingReaction[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<Guest | null>(guests[1]);
  const [isHost, setIsHost] = useState(true);
  const [viewerCount, setViewerCount] = useState(1247);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "pixelpoet", message: "This set is INSANE 🔥", time: "just now" },
    { id: 2, user: "circuitclown", message: "The timing on that last one was perfect", time: "1m ago" },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  
  // === MICRO-PAYMENT VERIFICATION GATE ($0.99) ===
  // This is the "outside the box" anti-bot + micro-revenue layer.
  // Real users pay $0.99 once to prove they have a valid payment method.
  // Bots/farmers rarely bother with real cards for tiny amounts.
  // Revenue can fund prizes, better models, or event production.
  // In production replace the simulate button with Stripe Checkout.
  const [isVerified, setIsVerified] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasAttemptedGatedAction, setHasAttemptedGatedAction] = useState(false);

  const requireVerification = (action: string) => {
    if (isVerified) return true;
    setHasAttemptedGatedAction(true);
    setShowPaymentModal(true);
    return false;
  };

  const simulatePayment = () => {
    // In real version: create Stripe Checkout Session on backend
    // then redirect: window.location = session.url
    // On success webhook or client callback -> setIsVerified(true)
    setIsVerified(true);
    setShowPaymentModal(false);
    // Optional: show success toast/neon animation
    setTimeout(() => {
      alert("✅ Verified Human Ticket purchased! Welcome to the real stage. (This is a simulation — real Stripe integration is one API call away)");
    }, 300);
  };

  // Simulate live viewer growth
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Simulate occasional random reactions from "audience"
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        handleReactionClick(randomReaction.emoji, true);
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [reactions]);

  // Handle Stripe success redirect (?payment=success)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      setIsVerified(true);
      setShowPaymentModal(false);
      
      // Neon celebration
      const celebration = document.createElement('div');
      celebration.textContent = '🎉 VERIFIED HUMAN TICKET ACCEPTED — WELCOME TO THE REAL STAGE!';
      celebration.style.cssText = `
        position: fixed; 
        top: 25%; 
        left: 50%; 
        transform: translate(-50%, -50%);
        background: #000;
        color: #00ff9f;
        padding: 24px 48px;
        border: 3px solid #00ff9f;
        border-radius: 9999px;
        font-size: 20px;
        font-weight: 700;
        z-index: 9999;
        box-shadow: 0 0 60px #00ff9f;
        text-align: center;
        animation: neonPop 4s forwards;
        pointer-events: none;
      `;
      document.body.appendChild(celebration);
      
      setTimeout(() => {
        celebration.style.transition = 'opacity 1s';
        celebration.style.opacity = '0';
        setTimeout(() => document.body.removeChild(celebration), 1200);
      }, 2800);
      
      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const addFlyingReaction = (emoji: string) => {
    const newFlying: FlyingReaction = {
      id: Date.now(),
      emoji,
      x: Math.random() * 60 + 20, // percent
      y: 70,
      rotation: Math.random() * 40 - 20,
    };
    setFlyingReactions(prev => [...prev, newFlying]);
    
    // Remove after animation
    setTimeout(() => {
      setFlyingReactions(prev => prev.filter(r => r.id !== newFlying.id));
    }, 2200);
  };

  const handleReactionClick = useCallback((emoji: string, isAuto = false) => {
    if (!isAuto && !requireVerification('send-reaction')) {
      return; // blocked until verified
    }
    
    setReactions(prev => 
      prev.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r)
    );
    
    if (!isAuto) {
      setSelectedReaction(emoji);
      setTimeout(() => setSelectedReaction(null), 600);
    }
    
    addFlyingReaction(emoji);
    
    // Add to chat occasionally
    if (Math.random() > 0.7 && !isAuto) {
      const reactionNames = ['neonfan42', 'promptpunk', 'llmlegend', 'synthslayer'];
      const randomName = reactionNames[Math.floor(Math.random() * reactionNames.length)];
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        user: randomName,
        message: `${emoji} ${emoji} ${emoji}`,
        time: 'just now'
      }].slice(-8));
    }
  }, [isVerified]);

  const promoteToStage = (guestId: number) => {
    setGuests(prev => prev.map(g => {
      if (g.id === guestId) {
        return { ...g, status: 'onstage' as const };
      }
      if (g.status === 'onstage') {
        return { ...g, status: 'approved' as const };
      }
      return g;
    }));
    
    const promoted = guests.find(g => g.id === guestId);
    if (promoted) {
      setCurrentSpeaker(promoted);
    }
  };

  const removeGuest = (guestId: number) => {
    setGuests(prev => prev.filter(g => g.id !== guestId));
    if (currentSpeaker?.id === guestId) {
      setCurrentSpeaker(null);
    }
  };

  const toggleMute = (guestId: number) => {
    setGuests(prev => prev.map(g => 
      g.id === guestId ? { ...g, isMuted: !g.isMuted } : g
    ));
  };

  const addMockGuest = () => {
    const newGuest: Guest = {
      id: Date.now(),
      name: ["EchoEntity", "TokenTyrant", "VectorVibe", "ModelMystic"][Math.floor(Math.random()*4)],
      handle: `@${Math.random().toString(36).substring(2, 8)}`,
      status: 'waiting',
      avatarColor: ['bg-cyan-400', 'bg-fuchsia-400', 'bg-violet-400', 'bg-emerald-400'][Math.floor(Math.random()*4)],
    };
    setGuests(prev => [...prev, newGuest]);
  };

  const sendChatMessage = () => {
    if (!newMessage.trim()) return;
    if (!requireVerification('send-chat')) return;
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      user: isHost ? "HOST" : "you",
      message: newMessage,
      time: 'just now'
    }].slice(-12));
    setNewMessage('');
  };

  const currentReactions = reactions.reduce((acc, r) => {
    acc[r.emoji] = r.count;
    return acc;
  }, {} as Record<string, number>);

  // Payment modal using your exact live Stripe Buy Button
  const PaymentGateModal = () => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-zinc-900 border-2 border-cyan-400 rounded-3xl p-10 text-center neon-border relative overflow-hidden"
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black px-8 py-2 border border-cyan-400 rounded-full text-cyan-400 text-sm font-mono tracking-widest">
          AI BARTENDER
        </div>
        
        <div className="text-6xl mb-6">🎟️</div>
        <h2 className="text-4xl font-bold mb-4 neon-text">Verified Human Ticket</h2>
        <p className="text-xl text-white/80 mb-8">
          Only <span className="text-cyan-400 font-bold">$0.99</span><br />
          to prove you're real and unlock the full stage.
        </p>
        
        <div className="text-sm text-white/60 mb-8 space-y-3">
          <p>• Filters out bots and fake accounts</p>
          <p>• Funds better AI models and event prizes</p>
          <p>• One-time payment = lifetime access to queue, reactions, Grok 4.20, and chat</p>
          <p className="text-cyan-400">Think of it as buying the AI bartender a digital drink.</p>
        </div>

        {/* Your exact Stripe Buy Button - Live mode */}
        <div className="my-8 flex justify-center">
          <stripe-buy-button
            buy-button-id="buy_btn_1TPNjZK5abcrIcyeVmnyfbsD"
            publishable-key="pk_live_51P4BLMK5abcrIcyebzFrrEwI0T1vTbKG1HzgZTwNLuSurwwwuXNNjfJjxTfOMua5Jp1rArP8AQPpyATYl74jDYY100pkzkc9vj"
          >
          </stripe-buy-button>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => setShowPaymentModal(false)}
          className="text-white/50 hover:text-white text-sm"
        >
          Maybe later (use demo mode)
        </Button>

        <div className="mt-8 text-[10px] text-white/30 font-mono">
          Powered by Stripe • Live keys • Success URL should return you here
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050507] text-white overflow-hidden font-sans">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-[0_0_25px_-3px] shadow-cyan-400">
                <Mic className="w-6 h-6 text-black" />
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tighter neon-text">AI OPEN MIC</div>
                <div className="text-[10px] text-cyan-400 -mt-1 tracking-[3px] font-mono">NEURAL STAGE • LIVE</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-1 rounded-full text-sm font-medium border border-red-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              LIVE
            </div>

            {/* Viewer Count */}
            <div className="flex items-center gap-2 text-sm font-mono bg-white/5 px-4 py-1.5 rounded-xl border border-white/10">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>{viewerCount.toLocaleString()}</span>
              <span className="text-white/40">watching</span>
            </div>

            {/* Verification Status */}
            <div className={`px-4 py-1 rounded-full text-xs font-mono flex items-center gap-2 border ${isVerified ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10' : 'border-amber-400 text-amber-400 bg-amber-500/10'}`}>
              {isVerified ? '✅ VERIFIED HUMAN' : '🔒 $0.99 TICKET REQUIRED'}
            </div>

            {/* View Toggle */}
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
              <Button
                variant={isHost ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsHost(true)}
                className={`rounded-lg ${isHost ? 'bg-white text-black shadow-lg' : ''}`}
                data-testid="toggle-host"
              >
                HOST
              </Button>
              <Button
                variant={!isHost ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsHost(false)}
                className={`rounded-lg ${!isHost ? 'bg-white text-black shadow-lg' : ''}`}
                data-testid="toggle-audience"
              >
                AUDIENCE
              </Button>
            </div>

            <Button onClick={addMockGuest} variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black gap-2" data-testid="add-guest-btn">
              <Zap className="w-4 h-4" /> ADD GUEST
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-20 flex h-screen max-w-7xl mx-auto">
        {/* MAIN STAGE + CAROUSEL */}
        <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
          {/* STAGE */}
          <Card className="flex-1 bg-zinc-950 border-white/10 relative overflow-hidden shadow-2xl neon-border" data-testid="stage-card">
            <CardHeader className="border-b border-white/10 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-mono tracking-widest rounded border border-emerald-500/30">LIVE ON STAGE</div>
                  {currentSpeaker && (
                    <span className="font-mono text-cyan-400">{currentSpeaker.handle}</span>
                  )}
                </CardTitle>
                {currentSpeaker && (
                  <Badge variant="outline" className="border-emerald-400 text-emerald-400 px-3 py-1">NOW PERFORMING</Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col items-center justify-center p-12 relative">
              {currentSpeaker ? (
                <div className="text-center relative z-10">
                  <div className="mx-auto w-32 h-32 rounded-3xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mb-8 shadow-[0_0_60px_-10px] shadow-cyan-400">
                    <Mic className="w-16 h-16 text-black" />
                  </div>
                  <h1 className="text-6xl font-bold mb-2 tracking-tighter neon-text">{currentSpeaker.name}</h1>
                  <p className="text-2xl text-white/60 font-light">{currentSpeaker.handle}</p>
                  <div className="mt-8 flex gap-4 justify-center">
                    <Button variant="outline" size="lg" className="border-white/30 hover:border-white gap-2" onClick={() => toggleMute(currentSpeaker.id)}>
                      {currentSpeaker.isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      {currentSpeaker.isMuted ? 'UNMUTE' : 'MUTE'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-8xl mb-6 opacity-30">🎤</div>
                  <p className="text-3xl text-white/40 font-light">No one on stage yet</p>
                  <p className="text-white/30 mt-3">Promote a guest from the queue</p>
                </div>
              )}

              {/* Flying Reactions Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <AnimatePresence>
                  {flyingReactions.map((reaction) => (
                    <motion.div
                      key={reaction.id}
                      initial={{ 
                        opacity: 0.9, 
                        scale: 0.6, 
                        y: reaction.y + '%',
                        x: `${reaction.x}%`,
                      }}
                      animate={{ 
                        opacity: 0, 
                        scale: 1.8, 
                        y: '-30%',
                        x: `${reaction.x + (Math.random() * 15 - 7)}%`,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2.1, ease: "easeOut" }}
                      className="absolute text-6xl drop-shadow-2xl"
                      style={{ 
                        left: `${reaction.x}%`, 
                        top: `${reaction.y}%`,
                        transform: `rotate(${reaction.rotation}deg)`
                      }}
                    >
                      {reaction.emoji}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Reaction burst indicator */}
              {selectedReaction && (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute text-8xl pointer-events-none z-20"
                >
                  {selectedReaction}
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* SHOWCASE CAROUSEL (SIMPLE HORIZONTAL SCROLL FOR DEMO) */}
          <Card className="border-white/10 bg-zinc-950/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="text-yellow-400" /> FEATURED PERFORMANCES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                {showcaseItems.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="min-w-[280px] snap-start"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="bg-zinc-900 border-white/10 hover:border-cyan-400/60 h-full transition-all group cursor-pointer neon-border" 
                      onClick={() => window.open(item.link, '_blank')}
                    >
                      <CardContent className="p-6">
                        <div className="text-7xl mb-6 transition-transform group-hover:scale-110 duration-300">{item.emoji}</div>
                        <h4 className="font-semibold text-2xl mb-2 group-hover:text-cyan-300 transition-colors tracking-tight">{item.title}</h4>
                        <p className="text-sm text-white/70 mb-6 line-clamp-3">{item.description}</p>
                        <div className="flex justify-between items-center text-xs pt-4 border-t border-white/10">
                          <span className="font-mono text-cyan-400">{item.creator}</span>
                          <div className="flex items-center gap-1 text-cyan-400/70 group-hover:text-cyan-400">
                            EXPLORE <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="text-center text-[10px] font-mono text-white/40 mt-2">← SCROLL FOR MORE FEATURED AI CREATIONS →</div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL - QUEUE + REACTIONS + CHAT */}
        <div className="w-96 border-l border-white/10 bg-zinc-950 flex flex-col h-full">
          {/* REACTIONS BAR */}
          <div className="p-6 border-b border-white/10">
            <div className="text-xs uppercase tracking-widest text-white/50 mb-4 font-mono">SEND REACTIONS</div>
            <div className="grid grid-cols-5 gap-3">
              {reactions.map((reaction) => (
                <Button
                  key={reaction.id}
                  variant="ghost"
                  onClick={() => handleReactionClick(reaction.emoji)}
                  className={`h-16 text-4xl hover:scale-125 active:scale-90 transition-all flex flex-col items-center justify-center border border-white/10 hover:border-cyan-400/50 ${selectedReaction === reaction.emoji ? 'border-cyan-400 bg-cyan-400/10' : ''}`}
                  data-testid={`reaction-${reaction.emoji}`}
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-[10px] text-white/60 mt-1 font-mono">{reaction.count}</span>
                </Button>
              ))}
            </div>
            <div className="text-center text-[10px] text-white/30 mt-3 font-mono">REACTIONS APPEAR LIVE ON STAGE</div>
          </div>

          {/* GUEST QUEUE */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="uppercase text-xs tracking-[1px] font-mono flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                LIVE GUEST QUEUE ({guests.length})
              </div>
              {isHost && (
                <Badge variant="secondary" className="text-[10px]">HOST CONTROLS ENABLED</Badge>
              )}
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {guests.map((guest, index) => (
                  <Card key={guest.id} className={`border-white/10 bg-zinc-900/80 transition-all ${guest.status === 'onstage' ? 'ring-2 ring-offset-2 ring-offset-zinc-950 ring-cyan-400' : ''}`}>
                    <CardContent className="p-4 flex gap-4 items-center">
                      <Avatar className="w-11 h-11 ring-1 ring-white/20">
                        <AvatarFallback className={`${guest.avatarColor} text-black font-bold text-xl`}>
                          {guest.name.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{guest.name}</div>
                        <div className="text-xs text-white/50 font-mono">{guest.handle}</div>
                        <div className="flex gap-2 mt-2">
                          <Badge 
                            variant={guest.status === 'onstage' ? "default" : "secondary"} 
                            className={`text-[10px] ${guest.status === 'onstage' ? 'bg-emerald-500 text-black' : ''}`}
                          >
                            {guest.status.toUpperCase()}
                          </Badge>
                          {guest.isMuted && <Badge variant="destructive" className="text-[10px]">MUTED</Badge>}
                        </div>
                      </div>

                      {isHost && (
                        <div className="flex flex-col gap-1">
                          {guest.status !== 'onstage' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 px-3 text-xs border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black"
                              onClick={() => {
                                if (requireVerification('promote-guest')) {
                                  promoteToStage(guest.id);
                                }
                              }}
                              data-testid={`promote-${guest.id}`}
                            >
                              PROMOTE
                            </Button>
                          )}
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 w-7 p-0 text-white/60 hover:text-white"
                              onClick={() => toggleMute(guest.id)}
                              data-testid={`mute-${guest.id}`}
                            >
                              {guest.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 w-7 p-0 text-red-400 hover:text-red-500"
                              onClick={() => removeGuest(guest.id)}
                              data-testid={`drop-${guest.id}`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {guests.length === 0 && (
                  <div className="text-center py-12 text-white/30">Queue is empty. Add some guests!</div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* CHAT */}
          {isChatOpen && (
            <div className="border-t border-white/10 bg-zinc-900 flex flex-col h-80">
              <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between bg-black/60">
                <div className="font-mono uppercase text-xs tracking-widest">Live Chat</div>
                <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)} className="h-6 w-6 p-0">
                  ✕
                </Button>
              </div>
              
              <ScrollArea className="flex-1 p-4 text-sm">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="mb-4">
                    <span className="font-mono text-cyan-400 text-xs">{msg.user}</span>
                    <span className="text-white/70 ml-2">{msg.message}</span>
                    <div className="text-[10px] text-white/30 mt-0.5">{msg.time}</div>
                  </div>
                ))}
              </ScrollArea>
              
              <div className="p-4 border-t border-white/10 bg-black/60">
                <div className="flex gap-2">
                  <Input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder={isHost ? "Host announcement..." : "Send a message..."}
                    className="bg-zinc-900 border-white/20 focus:border-cyan-400 text-sm"
                    data-testid="chat-input"
                  />
                  <Button onClick={sendChatMessage} size="sm" className="bg-white text-black hover:bg-white/90">SEND</Button>
                </div>
                <div className="text-[10px] text-center text-white/30 mt-2">Messages are simulated for demo</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 h-14 border-t border-white/10 bg-black/90 backdrop-blur-xl z-50 flex items-center px-8 text-xs font-mono text-white/40">
        <div>$0.99 VERIFIED HUMAN TICKET • ANTI-BOT + MICRO-REVENUE • PRODUCTION SKELETON READY FOR WEBSOCKETS / STRIPE / SUPABASE</div>
        <div className="ml-auto flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>CONNECTED</span>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            variant="ghost" 
            size="sm"
            className="text-xs h-7 px-4 border-white/20"
          >
            RESET DEMO
          </Button>
        </div>
      </div>

      {/* PAYMENT GATE MODAL */}
      <AnimatePresence>
        {showPaymentModal && <PaymentGateModal />}
      </AnimatePresence>
    </div>
  );
}

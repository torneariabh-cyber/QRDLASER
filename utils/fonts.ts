export interface Font {
  name: string;
  sample: string;
  category: string;
}

export const FONTS: Font[] = [
  // Sans-serif
  { name: 'Arial', sample: 'Arial', category: 'Sans-serif' },
  { name: 'Helvetica', sample: 'Helvetica', category: 'Sans-serif' },
  { name: 'Verdana', sample: 'Verdana', category: 'Sans-serif' },
  { name: 'Tahoma', sample: 'Tahoma', category: 'Sans-serif' },
  { name: 'Trebuchet MS', sample: 'Trebuchet', category: 'Sans-serif' },
  { name: 'Open Sans', sample: 'Open Sans', category: 'Sans-serif' },
  { name: 'Roboto', sample: 'Roboto', category: 'Sans-serif' },
  { name: 'Montserrat', sample: 'Montserrat', category: 'Sans-serif' },
  { name: 'Raleway', sample: 'Raleway', category: 'Sans-serif' },
  { name: 'Poppins', sample: 'Poppins', category: 'Sans-serif' },
  { name: 'Nunito', sample: 'Nunito', category: 'Sans-serif' },
  { name: 'Quicksand', sample: 'Quicksand', category: 'Sans-serif' },
  { name: 'Inter', sample: 'Inter', category: 'Sans-serif' },
  { name: 'Manrope', sample: 'Manrope', category: 'Sans-serif' },
  { name: 'Josefin Sans', sample: 'Josefin', category: 'Sans-serif' },
  
  // Serif
  { name: 'Georgia', sample: 'Georgia', category: 'Serif' },
  { name: 'Times New Roman', sample: 'Times', category: 'Serif' },
  { name: 'Garamond', sample: 'Garamond', category: 'Serif' },
  { name: 'Palatino', sample: 'Palatino', category: 'Serif' },
  { name: 'Merriweather', sample: 'Merriweather', category: 'Serif' },
  { name: 'Playfair Display', sample: 'Playfair', category: 'Serif' },
  { name: 'Lora', sample: 'Lora', category: 'Serif' },
  { name: 'Cormorant Garamond', sample: 'Cormorant', category: 'Serif' },
  { name: 'Abril Fatface', sample: 'Abril', category: 'Serif' },
  
  // Display
  { name: 'Impact', sample: 'Impact', category: 'Display' },
  { name: 'Comic Sans MS', sample: 'Comic Sans', category: 'Display' },
  { name: 'Pacifico', sample: 'Pacifico', category: 'Display' },
  { name: 'Lobster', sample: 'Lobster', category: 'Display' },
  { name: 'Bangers', sample: 'Bangers', category: 'Display' },
  { name: 'Fredoka One', sample: 'Fredoka', category: 'Display' },
  { name: 'Righteous', sample: 'Righteous', category: 'Display' },
  { name: 'Bebas Neue', sample: 'Bebas Neue', category: 'Display' },
  { name: 'Oswald', sample: 'Oswald', category: 'Display' },
  { name: 'Anton', sample: 'Anton', category: 'Display' },
  { name: 'Alfa Slab One', sample: 'Alfa Slab', category: 'Display' },
  { name: 'Audiowide', sample: 'Audiowide', category: 'Display' },
  { name: 'Orbitron', sample: 'Orbitron', category: 'Display' },
  { name: 'Exo 2', sample: 'Exo 2', category: 'Display' },
  
  // Script
  { name: 'Dancing Script', sample: 'Dancing Script', category: 'Script' },
  { name: 'Great Vibes', sample: 'Great Vibes', category: 'Script' },
  { name: 'Satisfy', sample: 'Satisfy', category: 'Script' },
  { name: 'Cookie', sample: 'Cookie', category: 'Script' },
  { name: 'Alex Brush', sample: 'Alex Brush', category: 'Script' },
  { name: 'Cedarville Cursive', sample: 'Cedarville', category: 'Script' },
];

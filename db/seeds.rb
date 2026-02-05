# Clear existing data
Product.destroy_all
Category.destroy_all
User.destroy_all

# Create Users
users = []
user_configs = [
  { email: 'seller@minato.com', first: 'Minato', last: 'Seller', username: 'minato_official' },
  { email: 'dave@analog.com', first: 'Dave', last: 'Tape', username: 'analog_dave' },
  { email: 'sarah@vinyl.com', first: 'Sarah', last: 'Spinner', username: 'vinyl_queen' },
  { email: 'alex@hifi.com', first: 'Alex', last: 'Audio', username: 'hifi_alex' }
]

user_configs.each do |u|
  user = User.create!(
    email: u[:email],
    password: 'password',
    password_confirmation: 'password',
    first_name: u[:first],
    last_name: u[:last],
    username: u[:username]
  )
  users << user
  puts "✅ Created user: #{user.username}"
end

# Define Categories
categories = [
  "Reel-to-Reel",
  "Turntables",
  "Amplifiers",
  "Speakers",
  "Parts",
  "Memorabilia"
]

category_map = {}

categories.each do |cat_name|
  category_map[cat_name] = Category.create!(name: cat_name, description: "All things #{cat_name}")
end

puts "✅ Created #{categories.length} categories"

# Vintage Audio Data
audio_gear = [
  {
    title: "Revox B77 MKII",
    manufacturer: "Revox",
    model: "B77 MKII",
    year: 1980,
    condition: "Refurbished",
    price: 1200,
    description: "Legendary Revox B77 MKII 2-track reel-to-reel recorder. 3.75 / 7.5 ips. Recently serviced, new pinch roller and counter belt. Heads in excellent condition. Includes original dust cover.",
    category: "Reel-to-Reel",
    city: "Berlin",
    product_type: 1
  },
  {
    title: "Akai GX-747",
    manufacturer: "Akai",
    model: "GX-747",
    year: 1982,
    condition: "Mint",
    price: 3500,
    description: "The ultimate Akai. GX-747 with DBX. Silver face. Auto-reverse. Glass ferrite heads (GX) last forever. Fully functional and cosmetically stunning. A centerpiece for any collection.",
    category: "Reel-to-Reel",
    city: "Tokyo",
    product_type: 1
  },
  {
    title: "Technics SL-1200MK2",
    manufacturer: "Technics",
    model: "SL-1200MK2",
    year: 1979,
    condition: "Good",
    price: 800,
    description: "The industry standard. Technics SL-1200MK2 direct drive turntable. Bombproof construction. Pitch control works perfectly. Comes with Stanton 500 cartridge and original slipmat.",
    category: "Turntables",
    city: "New York",
    product_type: 1
  },
  {
    title: "Marantz 2270 Receiver",
    manufacturer: "Marantz",
    model: "2270",
    year: 1974,
    condition: "Refurbished",
    price: 1500,
    description: "Classic 70s Marantz warmth. Model 2270. 70 watts per channel. Wood case included. All lamps replaced with warm white LEDs. Phono stage sounds incredible.",
    category: "Amplifiers",
    city: "San Francisco",
    product_type: 1
  },
  {
    title: "Pioneer RT-909",
    manufacturer: "Pioneer",
    model: "RT-909",
    year: 1980,
    condition: "Excellent",
    price: 2200,
    description: "Iconic rack-mount reel-to-reel. Pioneer RT-909. Auto-reverse, 4-track. Blue fluoroscan meters are bright and responsive. New belt kit installed.",
    category: "Reel-to-Reel",
    city: "Los Angeles",
    product_type: 1
  },
  {
    title: "JBL L100 Century Speakers",
    manufacturer: "JBL",
    model: "L100 Century",
    year: 1973,
    condition: "Good",
    price: 1800,
    description: "Vintage JBL L100 Century speakers. original Quadrex foam grilles (orange). Walnut cabinets. Drivers are pristine. The sound of the 70s.",
    category: "Speakers",
    city: "Chicago",
    product_type: 1
  },
  {
    title: "Teac X-1000R",
    manufacturer: "Teac",
    model: "X-1000R",
    year: 1981,
    condition: "Near Mint",
    price: 1600,
    description: "Teac X-1000R dbx. Black face model. 10.5 inch reel capacity. Bi-directional recording. Heads show minimal wear. Comes with original manual and NAB hubs.",
    category: "Reel-to-Reel",
    city: "Seattle",
    product_type: 1
  },
  {
    title: "Thorens TD-124 MKII",
    manufacturer: "Thorens",
    model: "TD-124 MKII",
    year: 1966,
    condition: "Refurbished",
    price: 2800,
    description: "Swiss precision. Thorens TD-124 MKII. Idler drive. SME 3009 tonearm with Shure V15 Type III cartridge. Plinth is solid wood custom build.",
    category: "Turntables",
    city: "Zurich",
    product_type: 1
  },
  {
    title: "Studer A810",
    manufacturer: "Studer",
    model: "A810",
    year: 1984,
    condition: "Show",
    price: 5500,
    description: "Professional broadcast master recorder. Studer A810. Console version. 2-track stereo. Butterfly heads. 3 speeds (7.5/15/30 ips). Fully calibrated.",
    category: "Reel-to-Reel",
    city: "Nashville",
    product_type: 1
  },
  {
    title: "McIntosh MC275 Tube Amp",
    manufacturer: "McIntosh",
    model: "MC275",
    year: 1965,
    condition: "Excellent",
    price: 4500,
    description: "The holy grail of tube amps. McIntosh MC275. Gordon Gow Commemorative Edition. 75 watts x 2. Tubes are fresh Gold Lion KT88s. Sounds holographic.",
    category: "Amplifiers",
    city: "Austin",
    product_type: 1
  },
  {
    title: "NAB Hub Adapters (Pair)",
    manufacturer: "Generic",
    model: "NAB Hub",
    year: 2020,
    condition: "Mint",
    price: 85,
    description: "Pair of generic NAB hub adapters for 10.5 inch reels. Aluminum construction. Fit Pioneer, Akai, Teac, Revox.",
    category: "Parts",
    city: "Miami",
    product_type: 2
  },
  {
    title: "Maxell XLI 35-180B Tape",
    manufacturer: "Maxell",
    model: "XLI 35-180B",
    year: 1985,
    condition: "Mint",
    price: 60,
    description: "Sealed vintage Maxell XLI 35-180B back-coated tape. 10.5 inch metal reel. Stored in climate controlled studio.",
    category: "Parts",
    city: "London",
    product_type: 2
  },
  {
    title: "Pink Floyd - Dark Side of the Moon (Master Tape Copy)",
    manufacturer: "EMI",
    model: "Master Tape Copy",
    year: 1973,
    condition: "Mint",
    price: 350,
    description: "15ips 2-track copy of DSOTM master tape. IEC equalization. High quality SM911 tape. Incredible dynamic range compared to vinyl.",
    category: "Memorabilia",
    city: "Toronto",
    product_type: 3
  },
  {
    title: "Akai Service Manual Collection",
    manufacturer: "Akai",
    model: "Service Manuals",
    year: 1980,
    condition: "Used",
    price: 120,
    description: "Binder full of original Akai service manuals. Includes GX-635D, GX-747, GX-620. Essential for the collector/technician.",
    category: "Memorabilia",
    city: "Osaka",
    product_type: 3
  },
  {
    title: "Sansui 9090DB",
    manufacturer: "Sansui",
    model: "9090DB",
    year: 1976,
    condition: "Excellent",
    price: 1900,
    description: "Powerhouse receiver. Sansui 9090DB. 125 watts per channel. Dolby NR. Recently recapped. The wood case is near perfect.",
    category: "Amplifiers",
    city: "Vancouver",
    product_type: 1
  },
  {
    title: "Micro Seiki DD-40",
    manufacturer: "Micro Seiki",
    model: "DD-40",
    year: 1978,
    condition: "Near Mint",
    price: 1100,
    description: "Beautiful Micro Seiki DD-40 direct drive turntable. Rosewood base. MA-505 tonearm (one of the best). Speed is dead stable.",
    category: "Turntables",
    city: "Munich",
    product_type: 1
  }
]

require 'open-uri'

audio_gear.shuffle.each do |item|
  product = Product.create!(
    title: item[:title],
    price: item[:price],
    description: item[:description],
    category: category_map[item[:category]],
    seller: users.sample,
    sku: "AUDIO-#{SecureRandom.hex(4).upcase}",
    product_type: item[:product_type],
    city: item[:city],
    manufacturer: item[:manufacturer],
    model: item[:model],
    year: item[:year],
    condition: item[:condition]
  )

  # Attach 3 placeholder images for slider testing
  3.times do |i|
    begin
      downloaded_image = URI.open("https://placehold.co/600x400/333/FFF.png?text=#{item[:manufacturer]}+#{item[:model]}+#{i+1}")
      product.files.attach(io: downloaded_image, filename: "product_#{product.id}_#{i}.png")
    rescue => e
      puts "⚠️ Failed to attach image for #{product.title}: #{e.message}"
    end
  end
end

puts "✅ Created #{audio_gear.length} vintage audio products distributed among #{users.length} sellers."

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ctbdaguwxibcvlxohdqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0YmRhZ3V3eGliY3ZseG9oZHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NTQyNDcsImV4cCI6MjA2NzAzMDI0N30.RhTBnU_5NoFBtA0EDj-783wHRr61hpJL756K0-MZhdg';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key 길이:', supabaseKey.length);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, images, price')
      .limit(5);
    
    if (error) throw error;
    
    console.log('현재 저장된 상품들:');
    data.forEach(product => {
      console.log(`ID: ${product.id}, 이름: ${product.name}, 이미지: ${JSON.stringify(product.images)}, 가격: ${product.price}`);
    });
  } catch (error) {
    console.error('오류:', error.message);
  }
}

checkProducts();

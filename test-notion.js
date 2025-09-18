// Test script to check Notion integration
const { getAllUnifiedPosts, getUnifiedTags, getUnifiedCategories } = require('./src/lib/blog-service.ts');

async function testNotionIntegration() {
  console.log('🧪 Testing Notion Integration...\n');

  try {
    // Test unified posts
    console.log('📝 Fetching all unified posts...');
    const posts = await getAllUnifiedPosts();
    console.log(`Found ${posts.length} total posts:`);

    posts.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}" (Source: ${post.source || 'mdx'})`);
    });

    console.log('\n🏷️ Fetching unified tags...');
    const tags = await getUnifiedTags();
    console.log(`Found ${tags.length} tags:`, tags.map(t => `${t.tag} (${t.count})`).join(', '));

    console.log('\n📂 Fetching unified categories...');
    const categories = await getUnifiedCategories();
    console.log(`Found ${categories.length} categories:`, categories.map(c => `${c.category} (${c.count})`).join(', '));

  } catch (error) {
    console.error('❌ Error testing integration:', error.message);
    console.error('Full error:', error);
  }
}

testNotionIntegration();
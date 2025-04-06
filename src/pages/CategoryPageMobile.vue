<template>
  <q-page class="categories-page q-pa-md">
    <div class="q-mb-md">
      <h4 class="text-h5 q-my-none text-weight-bold text-center">دسته بندی ها</h4>
      <p class="text-caption text-center text-grey q-mt-sm">
        تمام دسته بندی های گردشگری در یک نگاه
      </p>
    </div>

    <!-- Search bar for categories -->
    <q-input
      v-model="searchQuery"
      outlined
      dense
      placeholder="جستجو در دسته بندی ها..."
      class="q-mb-md"
      clearable
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- Recent categories section (if there are any) -->
    <div v-if="recentCategories.length > 0" class="q-mb-lg">
      <div class="text-subtitle1 text-weight-medium q-mb-sm">اخیراً بازدید شده</div>
      <div class="row q-col-gutter-sm">
        <div v-for="(item, idx) in recentCategories" :key="'recent-' + idx" class="col-4">
          <q-card
            class="recent-category-card text-center cursor-pointer"
            flat
            bordered
            @click="navigateTo(item.route || item.categoryId)"
          >
            <q-card-section class="q-py-sm h-full">
              <q-icon :name="item.icon || 'label'" size="1.5rem" color="primary" class="q-mb-xs" />
              <div class="text-body2 ellipsis-2-lines">{{ item.label }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Categories grid view (shows when no search is active) -->
    <div v-if="!searchQuery" class="q-mb-lg">
      <q-tabs
        v-model="activeMainTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          v-for="(menu, index) in menuItems"
          :key="index"
          :name="'tab-' + index"
          :label="menu.label"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeMainTab" animated>
        <q-tab-panel
          v-for="(menu, index) in menuItems"
          :key="index"
          :name="'tab-' + index"
          class="q-pa-none q-mt-md"
        >
          <div class="row q-col-gutter-sm">
            <div v-for="(item, idx) in menu.items" :key="idx" class="col-4 q-mb-md">
              <q-card
                class="category-card text-center cursor-pointer"
                flat
                bordered
                @click="navigateTo(item.route || item.categoryId)"
              >
                <q-card-section class="q-pa-sm">
                  <q-icon
                    :name="item.icon || 'label'"
                    size="1.5rem"
                    color="primary"
                    class="q-mb-sm"
                  />
                  <div class="text-body2 ellipsis-2-lines">{{ item.label }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- Search results (shows when search is active) -->
    <div v-else class="q-mb-lg">
      <div class="text-subtitle1 q-mb-sm">نتایج جستجو</div>
      <div v-if="filteredCategories.length > 0" class="row q-col-gutter-sm">
        <div v-for="(item, idx) in filteredCategories" :key="'search-' + idx" class="col-6 q-mb-md">
          <q-item
            clickable
            v-ripple
            class="category-search-item"
            @click="navigateTo(item.route || item.categoryId)"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon || 'label'" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
              <q-item-label caption>{{ item.parentLabel }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
      <div v-else class="text-center q-pa-lg">
        <q-icon name="search_off" size="3rem" color="grey-5" />
        <div class="text-grey q-mt-sm">موردی یافت نشد</div>
      </div>
    </div>

    <!-- All categories accordion view -->
    <div class="q-mt-lg">
      <div class="text-subtitle1 text-weight-medium q-mb-sm">تمام دسته بندی ها</div>
      <div v-for="(menu, index) in menuItems" :key="'all-' + index" class="q-mb-md">
        <q-expansion-item
          :label="menu.label"
          :icon="menu.icon"
          header-class="bg-grey-2"
          expand-icon-class="text-primary"
          switch-toggle-side
          dense
        >
          <q-card>
            <q-card-section class="q-pa-md">
              <q-list separator>
                <q-item
                  v-for="(item, idx) in menu.items"
                  :key="idx"
                  clickable
                  v-ripple
                  @click="navigateTo(item.route || item.categoryId)"
                >
                  <q-item-section avatar>
                    <q-icon :name="item.icon || 'circle'" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_left" color="grey" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Define props
const props = defineProps({
  menuItems: {
    type: Array,
    required: true,
  },
})

// Define emits
const emit = defineEmits(['navigate'])

// Local state
const searchQuery = ref('')
const activeMainTab = ref('tab-0')
const recentCategories = ref([])

// Get all categories in a flat array for search
const allCategories = computed(() => {
  const result = []
  props.menuItems.forEach((menu) => {
    menu.items.forEach((item) => {
      result.push({
        ...item,
        parentLabel: menu.label,
      })
    })
  })
  return result
})

// Filter categories based on search query
const filteredCategories = computed(() => {
  if (!searchQuery.value) return []

  const query = searchQuery.value.toLowerCase()
  return allCategories.value.filter(
    (item) =>
      item.label.toLowerCase().includes(query) || item.parentLabel.toLowerCase().includes(query),
  )
})

// Navigation handler
const navigateTo = (path) => {
  emit('navigate', path)
}

onMounted(() => {
  // Load recent categories from localStorage
  try {
    const savedCategories = localStorage.getItem('recentCategories')
    if (savedCategories) {
      recentCategories.value = JSON.parse(savedCategories)
    }
  } catch (e) {
    console.error('Error loading recent categories:', e)
  }
})
</script>

<style scoped>
.categories-page {
  padding-bottom: 80px;
}

.category-card {
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.category-card:hover,
.recent-category-card:hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.02);
}

.recent-category-card {
  transition: all 0.3s ease;
  border-radius: 8px;
  height: 100%;
}

.category-search-item {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-bottom: 4px;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.q-tab-panels {
  background: transparent;
}
</style>

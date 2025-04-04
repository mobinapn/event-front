<template>
  <q-card class="trip-card q-mb-md" flat bordered>
    <q-card-section class="trip-header">
      <div class="row justify-between items-center">
        <div class="trip-title-section">
          <div class="text-h6 trip-title">{{ trips.tripData.title }}</div>
          <q-badge color="primary" class="q-mr-sm">{{ formatPaymentMethod(trips.paymentMethod) }}</q-badge>
          <q-badge :color="getStatusColor(trips.status)" class="q-mr-sm">
            {{ trips.status ? formatStatus(trips.status) : 'فعال' }}
          </q-badge>
        </div>
        <div class="text-caption text-grey-7">
          تاریخ خرید: {{ formatDate(trips.purchaseDate) }}
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="trip-details">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <div class="detail-block">
                <div class="detail-title">تاریخ سفر</div>
                <div class="detail-content">
                  <q-icon name="event" size="sm" color="primary" class="q-mr-xs" />
                  {{ formatDate(trips.tripData.startDate) }} تا {{ formatDate(trips.tripData.endDate) }}
                </div>
              </div>
            </div>
            
            <div class="col-12 col-sm-6">
              <div class="detail-block">
                <div class="detail-title">مسافران</div>
                <div class="detail-content">
                  <q-icon name="people" size="sm" color="primary" class="q-mx-xs" />
                  {{ trips.tripData.totalAdults }} بزرگسال
                  <span v-if="trips.tripData.totalChildren > 0">
                    ، {{ trips.tripData.totalChildren }} کودک
                  </span>
                </div>
              </div>
            </div>
            
            <div class="col-12 col-sm-6">
              <div class="detail-block">
                <div class="detail-title">مبلغ کل</div>
                <div class="detail-content">
                  <q-icon name="payments" size="sm" color="primary" class="q-mx-xs" />
                  <span class="text-weight-bold q-pl-xs">{{ formatPrice(trips.totalAmount) }}</span> تومان
                </div>
              </div>
            </div>
            
            <div class="col-12 col-sm-6">
              <div class="detail-block">
                <div class="detail-title">شناسه تراکنش</div>
                <div class="detail-content text-overflow-ellipsis text-caption ">
                  <q-icon name="receipt_long" size="sm" color="primary" class="q-mr-xs" />
                  {{ trips.transactionId }}
                </div>
              </div>
            </div>
          </div>
          
          <q-expansion-item
            icon="people_alt"
            label="اطلاعات مسافران"
            caption="مشاهده جزئیات مسافران"
            header-class="text-primary"
            expand-icon-class="text-primary"
          >
            <q-card>
              <q-card-section>
                <div v-for="(passenger, index) in trips.passengersData" :key="index" class="passenger-info q-mb-sm">
                  <div class="row items-center">
                    <q-avatar color="primary" text-color="white" size="28px" class="q-mr-sm">
                      {{ index + 1 }}
                    </q-avatar>
                    <div class="passenger-name q-mr-sm">{{ passenger.firstname }} {{ passenger.lastname }}</div>
                  <div>
                      <div class="passenger-details text-caption">
                        <span class="q-mx-sm">کد ملی: {{ passenger.national_code }}</span>
                        <span class="q-mx-sm">جنسیت: {{ formatGender(passenger.gender) }}</span>
                        <span>  تاریخ تولد : {{ passenger.dob }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
        
        <div class="col-12 col-md-4">
          <div class="action-section">
            <q-btn
              v-if="!trips.status || trips.status === 'active'"
              color="negative"
              label=" استرداد بلیط"
              class="full-width q-mb-sm"
              @click="showCancelDialog = true"
              outline
            />
            <q-btn
            v-if="!trips.status || trips.status === 'active'"
              outline
              color="secondary"
              label="دانلود بلیط"
              class="full-width"
              icon="receipt"
              @click="downloadTicket"
            />
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Cancel Trip Dialog -->
    <q-dialog v-model="showCancelDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">لغو رزرو سفر</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <p>آیا از لغو رزرو سفر <strong>{{ trips.tripData.title }}</strong> اطمینان دارید؟</p>
          <p class="text-caption">
            <q-icon name="info" color="warning" />
            با توجه به قوانین لغو، مبلغ <strong>{{ calculateRefundAmount() }}</strong> تومان به کیف پول شما بازگردانده خواهد شد.
          </p>
        </q-card-section>

        <q-card-actions class="flex justify-between">
          <q-btn  label="تایید لغو رزرو" color="negative" @click="cancelTrip" :loading="cancelLoading" />
          <q-btn flat label="انصراف" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Cancellation Success Dialog -->
    <q-dialog v-model="showSuccessDialog">
      <q-card class="success-card">
        <q-card-section class="row items-center">
          <div class="text-center full-width">
            <q-icon name="check_circle" color="positive" size="4rem" />
            <div class="text-h6 q-mt-md">رزرو سفر با موفقیت لغو شد</div>
          </div>
        </q-card-section>

        <q-card-section>
          <p class="text-center">
            مبلغ <strong>{{ formatPrice(refundAmount) }}</strong> تومان به کیف پول شما بازگردانده شد.
          </p>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn color="primary" label="متوجه شدم" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { jsPDF } from 'jspdf'
import { Tanha } from 'app/public/fonts/Tanha-normal (1)'
import { useWalletStore } from 'src/stores/wallet' 

const props = defineProps({
  trips: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['trip-status-changed'])


const walletStore = useWalletStore() // Initialize the wallet store
const showCancelDialog = ref(false)
const showSuccessDialog = ref(false)
const cancelLoading = ref(false)
const refundAmount = ref(0)

// Format functions
const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  // Handle Persian date format directly if it's already in that format
  if (typeof dateString === 'string' && dateString.includes('/')) {
    return dateString
  }
  
  const date = new Date(dateString)
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Intl.DateTimeFormat('fa-IR', options).format(date)
}

const formatPrice = (price) => {
  if (!price) return '0'
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const formatGender = (gender) => {
  return gender === 1 ? 'زن' : 'مرد'
}

const formatPaymentMethod = (method) => {
  if (!method) return 'نامشخص'
  if (method.includes('wallet')) return 'کیف پول'
  return method
}

const formatStatus = (status) => {
  switch (status) {
    case 'canceled': return 'لغو شده'
    case 'active': return 'فعال'
    case 'completed': return 'انجام شده'
    default: return status
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'canceled': return 'negative'
    case 'active': return 'positive'
    case 'completed': return 'blue-grey'
    default: return 'positive'
  }
}

// Calculate refund amount (with penalty fee)
const calculateRefundAmount = () => {
  const startDate = new Date(props.trips.tripData.startDate)
  const today = new Date()
  const daysDifference = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24))
  
  let refundPercentage = 0
  if (daysDifference > 7) {
    refundPercentage = 0.9 // 90% refund
  } else if (daysDifference > 3) {
    refundPercentage = 0.7 // 70% refund
  } else if (daysDifference > 1) {
    refundPercentage = 0.5 // 50% refund
  } else {
    refundPercentage = 0.2 // 20% refund
  }
  
  const amount = Math.floor(props.trips.totalAmount * refundPercentage)
  return formatPrice(amount)
}

// Trip actions
const cancelTrip = async () => {
  cancelLoading.value = true
  
  try {
    // Calculate refund amount 
    const refundPercent = props.trips.tripData.startDate ? 
      (new Date(props.trips.tripData.startDate) - new Date()) / (1000 * 60 * 60 * 24) > 7 ? 0.9 : 0.7 : 0.7
    
    refundAmount.value = Math.floor(props.trips.totalAmount * refundPercent)
    
    // API call to cancel the trip
    await axios.patch(`http://localhost:3000/purchased-trips/${props.trips.id}`, {
      status: 'canceled',
      refundAmount: refundAmount.value,
      cancelDate: new Date().toISOString()
    })
    
    // Use the wallet store to deposit the refund amount
    const refundResult = await walletStore.depositFunds(refundAmount.value)
    
    if (!refundResult.success) {
      throw new Error(refundResult.message || 'خطا در بازگرداندن مبلغ به کیف پول')
    }
    
    // Show success dialog
    showCancelDialog.value = false
    showSuccessDialog.value = true
    
    // Update local trip status
    emit('trip-status-changed', {
      id: props.trips.id,
      status: 'canceled'
    })
    
  } catch (error) {
    console.error('Error canceling trip:', error)
    // Error handling would go here
  } finally {
    cancelLoading.value = false
  }
}


const downloadTicket = () => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Add Persian font
  doc.addFileToVFS("Tanha.ttf", Tanha);
  doc.addFont("Tanha.ttf", "Tanha", "normal");
  doc.setFont("Tanha");
  
  // Helper function for RTL text
  const writeRtlText = (text, x, y) => {
    doc.text(text, x, y, { align: "right" });
  };

  // Airbnb-inspired color palette (minimal approach)
  const colors = {
    primary: [255, 90, 95],    // Airbnb red
    secondary: [0, 166, 153],  // Airbnb teal
    dark: [72, 72, 72],        // Dark text
    medium: [118, 118, 118],   // Medium gray text
    light: [248, 248, 248],    // Light background
    border: [235, 235, 235],   // Light border
    white: [255, 255, 255]     // White
  };
  
  // Clean white background with subtle border
  doc.setFillColor(...colors.white);
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.5);
  doc.roundedRect(10, 10, 190, 277, 2, 2, 'FD');
  
  // Header - clean with accent color
  doc.setFillColor(...colors.primary);
  doc.rect(10, 10, 190, 3, 'F');
  
  // Logo and title area - minimalist approach
  doc.setFillColor(...colors.white);
  doc.setTextColor(...colors.primary);
  doc.setFontSize(22);
  writeRtlText("بلیط سفر", 180, 30);
  
  // Simple logo
  doc.circle(25, 25, 10, 'S');
  doc.setFontSize(14);
  doc.text("سفر", 25, 29, { align: "center" });
  
  // Transaction ID - subtle highlight
  doc.setFillColor(...colors.light);
  doc.roundedRect(20, 40, 170, 16, 2, 2, 'F');
  doc.setTextColor(...colors.dark);
  doc.setFontSize(10);
  writeRtlText("شماره تراکنش:", 180, 51);
  doc.setTextColor(...colors.medium);
  doc.text(props.trips.transactionId, 100, 51);
  
  // Clean divider
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.3);
  doc.line(20, 65, 190, 65);
  
  // Trip info section - clean, minimal box
  doc.setTextColor(...colors.dark);
  doc.setFontSize(16);
  writeRtlText("اطلاعات سفر", 180, 80);
  
  // Trip details - clean typography with proper spacing
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  writeRtlText("عنوان سفر", 180, 95);
  doc.setTextColor(...colors.medium);
  doc.setFontSize(12);
  writeRtlText(props.trips.tripData.title, 140, 95);
  
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  writeRtlText("تاریخ شروع", 180, 110);
  doc.setTextColor(...colors.medium);
  doc.setFontSize(12);
  writeRtlText(formatDate(props.trips.tripData.startDate), 140, 110);
  
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  writeRtlText("تاریخ پایان", 180, 125);
  doc.setTextColor(...colors.medium);
  doc.setFontSize(12);
  writeRtlText(formatDate(props.trips.tripData.endDate), 140, 125);
  
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  writeRtlText("تعداد مسافران", 180, 140);
  doc.setTextColor(...colors.medium);
  doc.setFontSize(12);
  writeRtlText(props.trips.tripData.totalAdults + " بزرگسال", 140, 140);
  
  // Price info - subtle highlight with accent color
  doc.setFillColor(...colors.light);
  doc.roundedRect(50, 150, 140, 20, 2, 2, 'F');
  doc.setTextColor(...colors.primary);
  doc.setFontSize(14);
  writeRtlText("مبلغ کل: " + formatPrice(props.trips.totalAmount) + " تومان", 180, 164);
  
  // Another clean divider
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.3);
  doc.line(20, 180, 190, 180);
  
  // Passenger section title - clean typography
  doc.setTextColor(...colors.dark);
  doc.setFontSize(16);
  writeRtlText("اطلاعات مسافران", 180, 195);
  
  // List each passenger with clean spacing and typography
  let yPosition = 215;
  props.trips.passengersData.forEach((passenger) => {
    
    // Passenger name - prominent
    doc.setTextColor(...colors.dark);
    doc.setFontSize(13);
    writeRtlText(passenger.firstname + " " + passenger.lastname, 180, yPosition);
    yPosition += 15;
    
    // Passenger details - clean grid layout
    doc.setFillColor(...colors.light);
    doc.roundedRect(45, yPosition - 10, 145, 30, 2, 2, 'F');
    
    doc.setTextColor(...colors.dark);
    doc.setFontSize(10);
    writeRtlText("کد ملی:", 180, yPosition);
    doc.setTextColor(...colors.medium);
    doc.setFontSize(11);
    writeRtlText(passenger.national_code, 145, yPosition);
    
    doc.setTextColor(...colors.dark);
    doc.setFontSize(10);
    writeRtlText("جنسیت:", 100, yPosition);
    doc.setTextColor(...colors.medium);
    doc.setFontSize(11);
    writeRtlText(formatGender(passenger.gender), 65, yPosition);
    
    doc.setTextColor(...colors.dark);
    doc.setFontSize(10);
    writeRtlText("تاریخ تولد:", 180, yPosition + 15);
    doc.setTextColor(...colors.medium);
    doc.setFontSize(11);
    writeRtlText(passenger.dob, 145, yPosition + 15);
    
    yPosition += 35;
  });
  
  // Footer - minimal and elegant
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.3);
  doc.line(20, 275, 190, 275);
  
  
  // Issue date
  doc.setTextColor(...colors.medium);
  doc.setFontSize(9);
  writeRtlText("تاریخ صدور: " + new Date().toLocaleDateString('fa-IR'), 180, 285);
  
  // Save the PDF
  doc.save(`ticket-${props.trips.transactionId}.pdf`);
};
</script>

<style scoped>
.trip-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.trip-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.trip-header {
  background-color: rgba(0, 0, 0, 0.02);
}

.trip-title {
  margin-bottom: 8px;
  max-width: 100%;
  overflow: hidden;
}

.detail-block {
  margin-bottom: 16px;
}

.detail-title {
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 4px;
}

.detail-content {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

.passenger-name {
  font-weight: bold;
}

.passenger-details {
  color: #666;
}

.action-section {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding: 0 8px;
}

@media (max-width: 599px) {
  .action-section {
    margin-top: 16px;
  }
}

.success-card {
  text-align: center;
  padding: 16px;
  max-width: 400px;
}
</style>
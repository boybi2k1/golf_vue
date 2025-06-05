<template>
  <main class="flex-1 p-6 overflow-y-auto bg-green-100">
    <div class="bg-gray-50 min-h-screen">
      <!-- Hero Section -->
      <div
        class="relative h-96 bg-gradient-to-r from-green-800 to-green-600 overflow-hidden"
      >
        <img
          src="https://sangolf.vn/wp-content/uploads/2022/01/san-golf-pga-novaland-phan-thiet-novaland-1.jpg"
          alt="Sân golf"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <!-- Overlay màu với opacity thấp -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-green-900/60 to-green-600/40"
        ></div>
        <div
          class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center"
        >
          <div class="text-white">
            <h1 class="text-5xl md:text-6xl font-bold mb-4">
              Sân Golf <span class="text-green-300">Premium</span>
            </h1>
            <p class="text-xl md:text-2xl text-green-100 max-w-2xl">
              Trải nghiệm golf đẳng cấp quốc tế với cảnh quan tuyệt đẹp và dịch
              vụ hoàn hảo
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <button
                @click="() => $router.push('/booking')"
                class="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Đặt sân ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- Overview Section -->
        <section class="mb-16">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-4xl font-bold text-gray-900 mb-6">
                Tổng quan về sân golf
              </h2>
              <p class="text-lg text-gray-600 mb-6 leading-relaxed">
                Sân golf của chúng tôi được thiết kế hiện đại, đạt tiêu chuẩn
                quốc tế với hệ thống 18 lỗ, cảnh quan tuyệt đẹp và nhiều tiện
                ích cao cấp. Đây là điểm đến lý tưởng cho các golfer ở mọi trình
                độ.
              </p>
              <div class="grid grid-cols-2 gap-6">
                <div class="text-center p-4 bg-white rounded-lg shadow-md">
                  <div class="text-3xl font-bold text-green-600">18</div>
                  <div class="text-gray-600">Lỗ golf</div>
                </div>
                <div class="text-center p-4 bg-white rounded-lg shadow-md">
                  <div class="text-3xl font-bold text-green-600">72</div>
                  <div class="text-gray-600">Par chuẩn</div>
                </div>
                <div class="text-center p-4 bg-white rounded-lg shadow-md">
                  <div class="text-3xl font-bold text-green-600">6,800</div>
                  <div class="text-gray-600">Yards</div>
                </div>
                <div class="text-center p-4 bg-white rounded-lg shadow-md">
                  <div class="text-3xl font-bold text-green-600">4.8</div>
                  <div class="text-gray-600">Đánh giá</div>
                </div>
              </div>
            </div>
            <div class="relative">
              <img
                src="https://www.tansonnhatgolf.vn/pictures/catalog/gioi-thieu/IMG3618-copy-1-min-1.jpg"
                alt="Sân golf overview"
                class="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </section>

        <!-- Facilities Section -->
        <section class="mb-16">
          <div class="text-center mb-12">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">
              Tiện ích & Dịch vụ
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp đầy đủ các tiện ích hiện đại để mang đến trải
              nghiệm golf hoàn hảo nhất
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div
                class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
              >
                <svg
                  class="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Nhà hàng sang trọng
              </h3>
              <p class="text-gray-600">
                Phục vụ đa dạng món ăn Á - Âu với view nhìn ra sân golf tuyệt
                đẹp
              </p>
            </div>

            <div
              class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div
                class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
              >
                <svg
                  class="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Pro Shop</h3>
              <p class="text-gray-600">
                Cung cấp dụng cụ golf chính hãng từ các thương hiệu hàng đầu thế
                giới
              </p>
            </div>

            <div
              class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div
                class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
              >
                <svg
                  class="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Phòng locker cao cấp
              </h3>
              <p class="text-gray-600">
                Phòng thay đồ hiện đại, sạch sẽ với đầy đủ tiện nghi
              </p>
            </div>

            <div
              class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div
                class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
              >
                <svg
                  class="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Dịch vụ Caddy
              </h3>
              <p class="text-gray-600">
                Đội ngũ caddy chuyên nghiệp, am hiểu sân và hỗ trợ tận tình
              </p>
            </div>

            <div
              class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div
                class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
              >
                <svg
                  class="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Xe điện</h3>
              <p class="text-gray-600">
                Hệ thống xe điện hiện đại, di chuyển thuận tiện trên sân
              </p>
            </div>

            <div
              class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div
                class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
              >
                <svg
                  class="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Khu vực tập luyện
              </h3>
              <p class="text-gray-600">
                Sân tập phát bóng rộng rãi với các mục tiêu chuẩn xác
              </p>
            </div>
          </div>
        </section>

        <!-- Pricing Section -->
        <section class="mb-16">
          <div class="text-center mb-12">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">
              Bảng giá tham khảo
            </h2>
            <p class="text-lg text-gray-600">
              Giá cả hợp lý cho trải nghiệm golf đẳng cấp
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <!-- Pricing Card 1 -->
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div
                class="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white"
              >
                <h3 class="text-2xl font-bold mb-2">Khách lẻ</h3>
                <p class="text-green-100">Dành cho khách chơi thường xuyên</p>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div
                    class="flex justify-between items-center py-3 border-b border-gray-100"
                  >
                    <span class="text-gray-600">9 lỗ (Weekday)</span>
                    <span class="text-xl font-semibold text-gray-900"
                      >1.200.000đ</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-3 border-b border-gray-100"
                  >
                    <span class="text-gray-600">18 lỗ (Weekday)</span>
                    <span class="text-xl font-semibold text-gray-900"
                      >2.000.000đ</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-3 border-b border-gray-100"
                  >
                    <span class="text-gray-600">9 lỗ (Weekend)</span>
                    <span class="text-xl font-semibold text-gray-900"
                      >1.500.000đ</span
                    >
                  </div>
                  <div class="flex justify-between items-center py-3">
                    <span class="text-gray-600">18 lỗ (Weekend)</span>
                    <span class="text-xl font-semibold text-gray-900"
                      >2.500.000đ</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Pricing Card 2 -->
            <div
              class="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-500"
            >
              <div
                class="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white relative"
              >
                <div
                  class="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-3 py-1 text-sm font-semibold rounded-bl-lg"
                >
                  Ưu đãi
                </div>
                <h3 class="text-2xl font-bold mb-2">Hội viên</h3>
                <p class="text-green-100">Tiết kiệm đến 25% chi phí</p>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div
                    class="flex justify-between items-center py-3 border-b border-gray-100"
                  >
                    <span class="text-gray-600">9 lỗ (Weekday)</span>
                    <span class="text-xl font-semibold text-green-600"
                      >900.000đ</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-3 border-b border-gray-100"
                  >
                    <span class="text-gray-600">18 lỗ (Weekday)</span>
                    <span class="text-xl font-semibold text-green-600"
                      >1.500.000đ</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-3 border-b border-gray-100"
                  >
                    <span class="text-gray-600">9 lỗ (Weekend)</span>
                    <span class="text-xl font-semibold text-green-600"
                      >1.200.000đ</span
                    >
                  </div>
                  <div class="flex justify-between items-center py-3">
                    <span class="text-gray-600">18 lỗ (Weekend)</span>
                    <span class="text-xl font-semibold text-green-600"
                      >2.000.000đ</span
                    >
                  </div>
                </div>
                <button
                  class="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Đăng ký hội viên
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Location Section -->
        <section class="mb-16">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-4xl font-bold text-gray-900 mb-6">
                Vị trí & Liên hệ
              </h2>
              <div class="space-y-6">
                <div class="flex items-start space-x-4">
                  <div
                    class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <svg
                      class="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Địa chỉ</h3>
                    <p class="text-gray-600">
                      123 Đường Golf, Quận Green, TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div
                    class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <svg
                      class="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      Điện thoại
                    </h3>
                    <p class="text-gray-600">0123 456 789</p>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div
                    class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <svg
                      class="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Email</h3>
                    <p class="text-gray-600">info@golfcourse.vn</p>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div
                    class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <svg
                      class="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      Giờ hoạt động
                    </h3>
                    <p class="text-gray-600">5:30 - 18:30 (Hàng ngày)</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="relative">
              <iframe
                class="w-full h-96 rounded-2xl shadow-xl"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.502123!2d106.700000!3d10.776530!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzM1LjUiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1svi!2s!4v1680000000000!5m2!1svi!2s"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>

        <!-- Rules Section -->
        <section class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
            Quy định & Lưu ý
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div
                  class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <svg
                    class="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <p class="text-gray-700">Vui lòng đặt lịch trước khi đến sân</p>
              </div>
              <div class="flex items-start space-x-3">
                <div
                  class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <svg
                    class="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <p class="text-gray-700">
                  Tuân thủ quy định về trang phục và an toàn
                </p>
              </div>
            </div>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div
                  class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <svg
                    class="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <p class="text-gray-700">Không hút thuốc trong khu vực cấm</p>
              </div>
              <div class="flex items-start space-x-3">
                <div
                  class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <svg
                    class="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <p class="text-gray-700">
                  Giữ gìn vệ sinh chung và bảo vệ môi trường sân golf
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- CTA Section -->
      <div class="bg-gradient-to-r from-green-600 to-green-700 py-16">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Sẵn sàng trải nghiệm golf đẳng cấp?
          </h2>
          <p class="text-xl text-green-100 mb-8">
            Đặt lịch ngay hôm nay để nhận ưu đãi đặc biệt
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              class="bg-white text-green-700 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Đặt sân ngay
            </button>
            <button
              class="border-2 border-white text-white hover:bg-white hover:text-green-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
// Trang tĩnh, không cần logic JS phức tạp
</script>
